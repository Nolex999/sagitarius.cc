import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('BILLGANG WEBHOOK PAYLOAD:', JSON.stringify(payload, null, 2));

    // 1. Extract Order Info
    const order = payload.order || payload;
    const productName = order.product_name || order.product?.name || '';
    const metadata = order.metadata || payload.metadata || {};
    
    // Check metadata AND custom_fields for user_id
    let userId = (order.metadata || payload.metadata || {}).user_id;
    
    // Check custom_fields (can be array or object)
    if (!userId && order.custom_fields) {
       console.log('Inspecting custom_fields:', JSON.stringify(order.custom_fields));
       if (Array.isArray(order.custom_fields)) {
         const userField = order.custom_fields.find((f: any) => f.name === 'user_id' || f.name === 'User ID');
         if (userField) userId = userField.value;
       } else if (typeof order.custom_fields === 'object') {
         userId = order.custom_fields.user_id || order.custom_fields['User ID'];
       }
    }

    // 1. Parallelize User lookup and Category identification
    const customerEmail = order.customer?.email || payload.customer?.email;
    
    const [userResult, catResult] = await Promise.all([
      // Lookup user by email if userId missing
      (!userId && customerEmail) ? supabaseAdmin.from('profiles').select('id').eq('email', customerEmail).maybeSingle() : Promise.resolve({ data: userId ? { id: userId } : null }),
      // Search for category
      supabaseAdmin.from('software_categories').select('id, name').ilike('name', `%${(productName || '').toLowerCase().includes('r6') || (productName || '').toLowerCase().includes('siege') ? 'rainbow six siege' : (productName || '').toLowerCase().includes('cs2') || (productName || '').toLowerCase().includes('external') ? 'external' : 'cheat'}%`).limit(1).maybeSingle()
    ]);

    if (userResult.data) userId = userResult.data.id;
    let category = catResult.data;

    console.log('--- DIAGNOSTICS ---');
    console.log('User ID:', userId, '| Category:', category?.name);

    // Fallback if nothing found
    if (!category) {
      console.log('No specific category found, checking for ANY category...');
      const { data: allCats, error: allError } = await supabaseAdmin
        .from('software_categories')
        .select('id, name');
      
      if (allError) console.error('Supabase Query Error (All):', allError);
      console.log('Total categories in DB:', allCats?.length || 0);

      if (allCats && allCats.length > 0) {
        category = allCats[0];
      } else {
        // AUTO-CREATE A CATEGORY IF TOTALLY EMPTY
        console.log('DATABASE IS EMPTY! Auto-creating a default category...');
        const { data: newCat, error: createError } = await supabaseAdmin
          .from('software_categories')
          .insert({ name: 'Default Software', logo_url: null })
          .select()
          .maybeSingle();
        
        if (createError) {
          console.error('Failed to auto-create category:', createError);
          return NextResponse.json({ error: 'Database is empty and auto-creation failed' }, { status: 500 });
        }
        category = newCat;
      }
    }

    if (!category) {
      console.error('CRITICAL: No categories found and auto-creation failed.');
      return NextResponse.json({ error: 'Internal configuration error: No categories found' }, { status: 500 });
    }

    console.log('Selected category for key generation:', category.name, category.id);

    // 3. Map product name to duration for key metadata
    const productLower = (productName || '').toLowerCase();
    let duration: string | null = null;
    if (productLower === 'r6-7-days' || productLower.includes('7') && productLower.includes('day')) {
      duration = '7 days';
    } else if (productLower === 'r6-1-month' || productLower.includes('1') && productLower.includes('month')) {
      duration = '1 month';
    } else if (productLower === 'r6-3-months' || productLower.includes('3') && productLower.includes('month')) {
      duration = '3 months';
    } else if (productLower.includes('lifetime') || productLower.includes('illimité') || productLower.includes('unlimited')) {
      duration = null;
    }

    // 4. Generate a NEW key for this category (Automatic Generation)
    const randomKey = 'SAG-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                      Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
                      Math.random().toString(36).substring(2, 6).toUpperCase();

    // 5. Save the new key to the database
    const { data: keyData, error: insertError } = await supabaseAdmin
      .from('software_keys')
      .insert({
          key: randomKey,
          category_id: category.id,
          max_uses: 1,
          metadata: duration ? { duration } : {},
      })
      .select()
      .maybeSingle();

    if (insertError) {
      console.error('Failed to save generated key:', insertError);
      // Continue anyway to deliver to the user if possible
    }

    // 5. Deliver to Sagitarius Inbox (Optional)
    if (userId) {
      console.log('Delivering key to User ID:', userId);
      const { error: inboxError } = await supabaseAdmin
        .from('inbox_messages')
        .insert({
          user_id: userId,
          type: 'key',
          title: `Access Granted: ${productName || 'Software Access'}`,
          content: `Your purchase is complete! Your activation key is revealed below.`,
          reveal_content: randomKey,
          is_revealed: false,
          is_read: false
        });
      
      if (inboxError) {
        console.error('Failed to deliver key to inbox:', inboxError);
      } else {
        console.log('Key successfully delivered to inbox!');
      }
    }

    // 6. Explicitly signal Delivery to Billgang API (Reinforcement)
    // NOTE: For Dynamic Delivery, returning the JSON at the end is usually sufficient.
    // However, if the user explicitly wants us to "send successful delivered", 
    // we'll attempt it in the background to avoid timing out the webhook.
    const orderId = order.id || payload.data?.id || payload.id;
    const billgangKey = process.env.BILLGANG_API_KEY;
    const shopId = '254708457'; 

    if (orderId && billgangKey) {
      // Fire and forget (optional) OR try a different domain/endpoint if pg-api is 500ing
      // We log results but don't AWAIT them before returning to Billgang to prevent timeouts.
      (async () => {
        try {
          console.log(`Background delivery signal for Order: ${orderId}`);
          
          // Trying standard fulfillment path which some documentation suggests (might be 404/500 if dynamic already handles it)
          const deliverRes = await fetch(`https://pg-api.billgang.com/v1/dash/shops/${shopId}/orders/${orderId}/deliver`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${billgangKey}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              content: randomKey,
              textData: randomKey,
              delivered_goods: [randomKey]
            })
          });

          if (deliverRes.ok) {
            console.log('Billgang Manual Delivery SUCCESS');
          } else {
            const err = await deliverRes.text();
            console.warn(`Billgang Manual Delivery Signal (status ${deliverRes.status}):`, err.substring(0, 100));
          }
        } catch (err) {
          console.error('Billgang background delivery error:', err);
        }
      })();
    }

    // 7. Return the key to Billgang for Dynamic Delivery (Universal Format)
    // Many Billgang versions expect an array for delivered_goods
    console.log('Fulfilling Dynamic Delivery to Billgang:', randomKey);
    return NextResponse.json({ 
      success: true,
      status: "success",
      delivered_goods: [randomKey], // Array is often required
      content: randomKey,            // Alternative field name
      delivery_status: "DELIVERED",  // Explicitly tell them the state
      text_data: randomKey,          // Alternative field name
      data: {
        delivered_goods: [randomKey],
        content: randomKey
      }
    });

  } catch (error: any) {
    console.error('Billgang Dynamic Webhook Error:', error);
    // Returning a non-200 code signals a delivery failure to Billgang
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      status: "error"
    }, { status: 500 });
  }
}
