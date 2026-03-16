import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY;
const SELLAUTH_SHOP_ID = process.env.SELLAUTH_SHOP_ID;

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!SELLAUTH_API_KEY || !SELLAUTH_SHOP_ID) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    // Step 1: Fetch invoices from SellAuth
    // Note: We might need to handle pagination if there are many invoices
    const response = await fetch(`https://api.sellauth.com/v1/shops/${SELLAUTH_SHOP_ID}/invoices`, {
      headers: {
        'Authorization': `Bearer ${SELLAUTH_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SellAuth API Error:', errorData);
      throw new Error('Failed to fetch from SellAuth');
    }

    const { data: invoices } = await response.json();

    // Step 2: Filter for completed invoices matching the current user
    // We check either by email or by a custom field 'user_id' if available
    const completedInvoices = invoices.filter((inv: any) => {
      if (inv.status !== 'COMPLETED' && inv.status !== 'completed') return false;
      
      const matchEmail = inv.email?.toLowerCase() === user.email?.toLowerCase();
      
      // Check custom fields for user_id
      const customFields = inv.custom_fields || inv.additional_information || [];
      const userIdMatch = Array.isArray(customFields) && customFields.some((f: any) => 
        (f.name === 'user_id' || f.label === 'user_id') && f.value === user.id
      );

      return matchEmail || userIdMatch;
    });

    if (completedInvoices.length === 0) {
      return NextResponse.json({ message: 'No new completed payments found.' });
    }

    // Step 3: Check which ones haven't been added to our Inbox yet
    // We'll store the SellAuth invoice ID in a metadata field or just check for existing messages
    let processedCount = 0;
    
    for (const inv of completedInvoices) {
      // Check if this invoice ID was already processed
      const { data: existing } = await supabase
        .from('inbox_messages')
        .select('id')
        .contains('metadata', { sellauth_invoice_id: inv.id })
        .single();

      if (existing) continue;

      // Add to Inbox
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

      if (!insertError) processedCount++;
    }

    return NextResponse.json({ 
      success: true, 
      found: completedInvoices.length,
      newly_added: processedCount
    });

  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
