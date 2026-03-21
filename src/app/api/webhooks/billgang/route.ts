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
      supabaseAdmin.from('software_categories').select('id, name').ilike('name', `%${(productName || '').toLowerCase().includes('faceit') ? 'faceit' : (productName || '').toLowerCase().includes('cs2') || (productName || '').toLowerCase().includes('external') ? 'external' : 'cheat'}%`).limit(1).maybeSingle()
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

    // 3. Generate a NEW key for this category (Automatic Generation)
    const randomKey = 'SAG-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + 
                      Math.random().toString(36).substring(2, 6).toUpperCase() + '-' +
                      Math.random().toString(36).substring(2, 6).toUpperCase();

    // 4. Save the new key to the database
    const { data: keyData, error: insertError } = await supabaseAdmin
      .from('software_keys')
      .insert({
          key: randomKey,
          category_id: category.id,
          max_uses: 1,
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
    const orderId = order.id || payload.id;
    const billgangKey = process.env.BILLGANG_API_KEY;

    if (orderId && billgangKey) {
      console.log(`Sending explicit delivery signal to Billgang for Order: ${orderId}`);
      try {
        const deliverRes = await fetch(`https://api.billgang.com/v1/orders/${orderId}/deliver`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${billgangKey}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            content: randomKey
          })
        });

        if (deliverRes.ok) {
          console.log('Billgang Delivery API: Success');
        } else {
          const errorData = await deliverRes.text();
          console.error(`Billgang Delivery API: Failed (${deliverRes.status})`, errorData);
        }
      } catch (err) {
        console.error('Billgang Delivery API: Network Error', err);
      }
    } else {
      console.warn('Missing Order ID or Billgang API Key - Skipping explicit delivery signal.');
    }

    // 7. Return the key to Billgang for Dynamic Delivery (Original Method)
    console.log('Returning key to Billgang:', randomKey);
    return NextResponse.json({ 
      delivered_goods: randomKey 
    });

  } catch (error: any) {
    console.error('Billgang Dynamic Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
