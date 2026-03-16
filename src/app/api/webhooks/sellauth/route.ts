import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase admin (service role would be better for webhooks)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get('x-sellauth-signature') || req.headers.get('signature');
    
    // Webhook verification logic
    // SELLAUTH_WEBHOOK_SECRET should be set in your SellAuth dashboard and .env
    const secret = process.env.SELLAUTH_WEBHOOK_SECRET;
    
    if (secret && signature) {
      const hmac = crypto.createHmac('sha256', secret);
      const digest = hmac.update(rawBody).digest('hex');
      
      if (digest !== signature) {
        console.error('Webhook signature mismatch');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(rawBody);
    console.log('SellAuth Webhook Received:', payload);

    // Common SellAuth events: 'order.completed', 'order:completed'
    // The payload usually contains 'data' or 'order'
    const event = payload.event || payload.action;
    const order = payload.data || payload;

    if (event === 'order.completed' || event === 'order:completed' || order.status === 'COMPLETED') {
      // Extract custom field 'user_id'
      // Adjust based on SellAuth's actual payload structure
      const customFields = order.custom_fields || order.additional_information || [];
      let userId = '';
      
      // Look for user_id in custom fields
      if (Array.isArray(customFields)) {
        const userIdField = customFields.find((f: any) => 
          f.name?.toLowerCase().includes('user_id') || 
          f.label?.toLowerCase().includes('user_id')
        );
        userId = userIdField?.value || userIdField?.content;
      } else if (typeof customFields === 'object') {
        userId = customFields.user_id;
      }

      // If no user_id found, try to find by email
      if (!userId && order.email) {
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('id')
          .eq('email', order.email)
          .single();
        if (profile) userId = profile.id;
      }

      if (!userId) {
        console.warn('No User ID found for order:', order.id);
        return NextResponse.json({ message: 'User not found' }, { status: 200 });
      }

      // Extract the key/content delivered
      const deliveredGoods = order.delivered_goods || [];
      const keyContent = deliveredGoods.length > 0 
        ? deliveredGoods.map((g: any) => g.content || g).join(', ') 
        : 'Check your SellAuth email for your key.';

      // Create message in Sagitarius Inbox
      const { error: inboxError } = await supabaseAdmin
        .from('inbox_messages')
        .insert({
          user_id: userId,
          type: 'key',
          title: `New Software Key: ${order.product_name || 'Premium Access'}`,
          content: `Thank you for your purchase! Your activation key is ready to be revealed below. Order ID: ${order.id}`,
          reveal_content: keyContent,
          is_revealed: false,
          is_read: false
        });

      if (inboxError) throw inboxError;

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ message: 'Event ignored' });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
