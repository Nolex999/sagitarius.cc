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
    console.log('Creating Billgang Charge for Product:', productId, 'User:', user.email);
    
    if (!apiKey) {
      console.error('BILLGANG_API_KEY is missing');
      return NextResponse.json({ success: false, error: 'Billgang API key not configured' }, { status: 500 });
    }

    const response = await fetch('https://pg-api.billgang.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        product_id: productId,
        email: user.email,
        metadata: {
          user_id: user.id
        }
      })
    });

    let data;
    const text = await response.text();
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error('Billgang returned non-JSON response:', text);
      return NextResponse.json({ 
        success: false, 
        error: `Billgang Error: Invalid JSON response (Status ${response.status})`,
        details: text.substring(0, 100)
      }, { status: 500 });
    }

    if (!response.ok) {
      console.error('Billgang API Error:', response.status, data);
      return NextResponse.json({ 
        success: false, 
        error: data.message || `Billgang API Error ${response.status}`,
        details: data
      }, { status: response.status });
    }

    console.log('Billgang Charge Created:', data.checkout_url || data.url);

    // 3. Return the checkout_url
    return NextResponse.json({ 
      success: true, 
      payment_url: data.checkout_url || data.url 
    });

  } catch (error: any) {
    console.error('Payment Error (Full):', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error', 
      details: error.message 
    }, { status: 500 });
  }
}
