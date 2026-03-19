import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { productId, variantId } = await req.json();
    const supabase = await createClient();
    
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const apiKey = process.env.BILLGANG_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ success: false, error: 'Billgang API key not configured' }, { status: 500 });
    }

    // 2. Create Charge on Billgang
    // Following user's provided logic: POST https://pg-api.billgang.com/charges
    const response = await fetch('https://pg-api.billgang.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId, // or variantId if Billgang uses separate IDs
        email: user.email,
        metadata: {
          user_id: user.id
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Billgang Error:', data);
      return NextResponse.json({ 
        success: false, 
        error: data.message || 'Failed to create Billgang checkout' 
      }, { status: response.status });
    }

    // 3. Return the checkout_url
    return NextResponse.json({ 
      success: true, 
      payment_url: data.checkout_url || data.url 
    });

  } catch (error) {
    console.error('Payment Error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
