import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY;
const SELLAUTH_SHOP_ID = process.env.SELLAUTH_SHOP_ID;
const BILLGANG_API_KEY = process.env.BILLGANG_API_KEY;
const BILLGANG_SHOP_ID = '254708457'; // Extracted from API key: eyJpZCI6IjI1NDcwODQ1NyIs...

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let newlyAdded = 0;
    let totalFound = 0;

    // --- Section 1: SellAuth Verification ---
    if (SELLAUTH_API_KEY && SELLAUTH_SHOP_ID) {
      try {
        const response = await fetch(`https://api.sellauth.com/v1/shops/${SELLAUTH_SHOP_ID}/invoices`, {
          headers: {
            'Authorization': `Bearer ${SELLAUTH_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const { data: invoices } = await response.json();
          const completedInvoices = invoices.filter((inv: any) => {
            if (inv.status !== 'COMPLETED' && inv.status !== 'completed') return false;
            const matchEmail = inv.email?.toLowerCase() === user.email?.toLowerCase();
            const customFields = inv.custom_fields || inv.additional_information || [];
            const userIdMatch = Array.isArray(customFields) && customFields.some((f: any) => 
              (f.name === 'user_id' || f.label === 'user_id') && f.value === user.id
            );
            return matchEmail || userIdMatch;
          });

          totalFound += completedInvoices.length;

          for (const inv of completedInvoices) {
            const { data: existing } = await supabase
              .from('inbox_messages')
              .select('id')
              .contains('metadata', { sellauth_invoice_id: inv.id })
              .single();

            if (existing) continue;

            const deliveredGoods = inv.delivered_goods || [];
            const keyContent = deliveredGoods.length > 0 
              ? deliveredGoods.map((g: any) => g.content || g).join(', ') 
              : 'Key delivered via SellAuth email.';

            const { error: insertError } = await supabase
              .from('inbox_messages')
              .insert({
                user_id: user.id,
                type: 'key',
                title: `Key Claimed: ${inv.product_name || 'Software'}`,
                content: `Successfully verified your payment for order #${inv.id}.`,
                reveal_content: keyContent,
                metadata: { sellauth_invoice_id: inv.id }
              });

            if (!insertError) newlyAdded++;
          }
        }
      } catch (err) {
        console.error('SellAuth verification failed:', err);
      }
    }

    // --- Section 2: Billgang Verification ---
    if (BILLGANG_API_KEY && BILLGANG_SHOP_ID) {
      try {
        console.log(`Verifying Billgang for user: ${user.email}`);
        // Fetch recent orders for this shop
        // We try with searchString first, but we'll also filter manually to be sure
        const response = await fetch(`https://pg-api.billgang.com/v1/dash/shops/${BILLGANG_SHOP_ID}/orders?searchString=${encodeURIComponent(user.email!)}&limit=50`, {
          headers: {
            'Authorization': `Bearer ${BILLGANG_API_KEY}`,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          const orders = result.data || [];
          console.log(`Billgang found ${orders.length} potential orders.`);
          
          const completedOrders = orders.filter((order: any) => {
            const isCompleted = order.status === 'COMPLETED' || order.status === 'DELIVERED';
            const emailMatch = (order.customerEmail?.toLowerCase() === user.email?.toLowerCase()) || 
                               (order.customer?.email?.toLowerCase() === user.email?.toLowerCase());
            
            // Also check custom fields for user_id
            let userIdMatch = false;
            if (order.customFields) {
               if (Array.isArray(order.customFields)) {
                 userIdMatch = order.customFields.some((f: any) => (f.name === 'user_id' || f.label === 'user_id') && f.value === user.id);
               } else if (typeof order.customFields === 'object') {
                 userIdMatch = order.customFields.user_id === user.id;
               }
            }

            return isCompleted && (emailMatch || userIdMatch);
          });

          console.log(`Billgang found ${completedOrders.length} matching completed/delivered orders.`);
          totalFound += completedOrders.length;

          for (const order of completedOrders) {
            const { data: existing } = await supabase
              .from('inbox_messages')
              .select('id')
              .contains('metadata', { billgang_order_id: order.id })
              .single();

            if (existing) {
              console.log(`Order ${order.id} already in inbox.`);
              continue;
            }

            console.log(`Adding new order ${order.id} to inbox.`);
            
            // Try to extract key from order if available in delivered_goods
            const deliveredGoods = order.delivered_goods || order.deliveredFields || [];
            const keyContent = Array.isArray(deliveredGoods) && deliveredGoods.length > 0
              ? deliveredGoods.map((g: any) => typeof g === 'string' ? g : g.content || g.value || JSON.stringify(g)).join(', ')
              : "Key delivered via Billgang email.";

            const { error: insertError } = await supabase
              .from('inbox_messages')
              .insert({
                user_id: user.id,
                type: 'key',
                title: `Key Claimed: ${order.productName || 'Sagitarius Software'}`,
                content: `Successfully verified your Billgang payment for order #${order.id}.`,
                reveal_content: keyContent,
                metadata: { billgang_order_id: order.id }
              });

            if (!insertError) newlyAdded++;
          }
        } else {
          const errText = await response.text();
          console.error(`Billgang API error (${response.status}):`, errText);
        }
      } catch (err) {
        console.error('Billgang verification failed:', err);
      }
    }

    return NextResponse.json({ 
      success: true, 
      found: totalFound,
      newly_added: newlyAdded,
      message: newlyAdded > 0 ? `Success! Found ${newlyAdded} new key(s) in your Inbox.` : 'No new payments found.'
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
