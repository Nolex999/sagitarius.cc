import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const SELLAUTH_API_KEY = process.env.SELLAUTH_API_KEY;
const SELLAUTH_SHOP_ID = process.env.SELLAUTH_SHOP_ID;

export async function POST(req: NextRequest) {
  try {
    const { productId, variantId, email } = await req.json();
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!SELLAUTH_API_KEY || !SELLAUTH_SHOP_ID) {
      return NextResponse.json({ error: 'Payment system not configured' }, { status: 500 });
    }

    // SellAuth API v1 Checkout endpoint
    const response = await fetch(`https://api.sellauth.com/v1/shops/${SELLAUTH_SHOP_ID}/checkout`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SELLAUTH_API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId,
        email: email || user.email || 'customer@sagitarius.cc',
        custom_fields: {
            user_id: user.id
        },
        // We can pre-select a gateway if the user wants "Crypto Only"
        // gateway: 'BTC' // or 'LTC'
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('SellAuth Checkout API Error:', data);
      return NextResponse.json({ error: data.message || 'Failed to create checkout' }, { status: response.status });
    }

    // According to SellAuth API, 'data' usually contains the checkout session
    // Return the checkout details to the frontend
    return NextResponse.json({
        success: true,
        checkout: data.data || data
    });

  } catch (error: any) {
    console.error('Create checkout error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
