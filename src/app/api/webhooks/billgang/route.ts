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
    let userId = metadata.user_id;
    if (!userId && order.custom_fields) {
       const userField = order.custom_fields.find((f: any) => f.name === 'user_id');
       if (userField) userId = userField.value;
    }

    // FALLBACK: Look up user by email if userId is still missing
    const customerEmail = order.customer?.email || payload.customer?.email;
    if (!userId && customerEmail) {
      console.log('User ID missing, searching by email:', customerEmail);
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('email', customerEmail)
        .maybeSingle();
      
      if (profile) {
        userId = profile.id;
        console.log('Found User ID by email:', userId);
      }
    }

    console.log('--- DIAGNOSTICS ---');
    console.log('Service Role Key Present:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
    console.log('Processing order for:', productName || 'Unknown Product', 'User ID:', userId);

    // 2. Identify Category
    let categorySearch = '';
    const nameLower = (productName || '').toLowerCase();
    
    if (nameLower.includes('faceit')) categorySearch = 'faceit';
    else if (nameLower.includes('cs2') || nameLower.includes('external')) categorySearch = 'external';

    console.log('Searching for category with term:', categorySearch || 'cheat (fallback)');

    let { data: category, error: catError } = await supabaseAdmin
      .from('software_categories')
      .select('id, name')
      .ilike('name', `%${categorySearch || 'cheat'}%`)
      .limit(1)
      .maybeSingle();

    if (catError) console.error('Supabase Query Error (Primary):', catError);

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
          current_uses: 1,
          is_active: false, // Already "used" since it's for this specific order
          metadata: { billgang_order_id: order.id }
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to save generated key:', insertError);
      // Continue anyway to deliver to the user if possible
    }

    // 5. Deliver to Sagitarius Inbox (Optional)
    if (userId) {
      await supabaseAdmin
        .from('inbox_messages')
        .insert({
          user_id: userId,
          type: 'key',
          title: `Access Granted: ${productName}`,
          content: `Your purchase is complete! Your activation key is revealed below.`,
          reveal_content: randomKey,
          is_revealed: false,
          is_read: false
        });
    }

    // 6. Return the key to Billgang for Dynamic Delivery
    return NextResponse.json({ 
      delivered_goods: randomKey 
    });

  } catch (error: any) {
    console.error('Billgang Dynamic Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
