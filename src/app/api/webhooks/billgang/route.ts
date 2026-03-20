import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log('Billgang Dynamic Delivery Request:', JSON.stringify(payload, null, 2));

    // 1. Extract Order Info
    const order = payload.order || payload;
    const productName = order.product_name || order.product?.name || '';
    const metadata = order.metadata || payload.metadata || {};
    const userId = metadata.user_id;

    // 2. Identify Category
    let categorySearch = '';
    if (productName.toLowerCase().includes('faceit')) categorySearch = 'faceit';
    else if (productName.toLowerCase().includes('cs2') || productName.toLowerCase().includes('external')) categorySearch = 'external';

    const { data: category } = await supabaseAdmin
      .from('software_categories')
      .select('id, name')
      .ilike('name', `%${categorySearch || 'cheat'}%`)
      .limit(1)
      .single();

    if (!category) {
      console.error('Category not found for product:', productName);
      return NextResponse.json({ error: 'Internal configuration error: Category not found' }, { status: 500 });
    }

    // 3. Fetch an available key for this category
    const { data: keyData, error: keyError } = await supabaseAdmin
      .from('software_keys')
      .select('id, key, current_uses, max_uses')
      .eq('category_id', category.id)
      .eq('is_active', true)
      .gt('max_uses', 0)
      .order('created_at', { ascending: true })
      .limit(1)
      .single();

    if (keyError || !keyData) {
      console.error('No keys available for category:', category.name);
      return NextResponse.json({ 
        delivered_goods: "OUT_OF_STOCK: Please join our Discord for manual delivery: https://discord.gg/your-discord" 
      }, { status: 200 });
    }

    const { data: updatedKey, error: updateError } = await supabaseAdmin
      .from('software_keys')
      .update({ 
        current_uses: (keyData.current_uses || 0) + 1,
        is_active: (keyData.current_uses || 0) + 1 >= (keyData.max_uses || 1) ? false : true
      })
      .eq('id', keyData.id)
      .select()
      .single();

    // 5. Deliver to Sagitarius Inbox (Optional)
    if (userId) {
      await supabaseAdmin
        .from('inbox_messages')
        .insert({
          user_id: userId,
          type: 'key',
          title: `Access Granted: ${productName}`,
          content: `Your purchase is complete! Your activation key is revealed below.`,
          reveal_content: keyData.key,
          is_revealed: false,
          is_read: false
        });
    }

    // 6. Return the key to Billgang for Dynamic Delivery
    return NextResponse.json({ 
      delivered_goods: keyData.key 
    });

  } catch (error: any) {
    console.error('Billgang Dynamic Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
