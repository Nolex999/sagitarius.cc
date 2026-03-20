import { NextResponse } from 'next/server';

/**
 * Handle "createChargeFlow" from Billgang
 * Billgang will POST here with order details.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { currency, amount, metadata, notifyUrl } = body;
    const processToken = metadata?.processToken;

    console.log('Billgang Plugin Create Charge Received:', { currency, amount, processToken });

    // TODO: Integrate with actual payment provider (e.g. Forebit, Hoodpay, etc.)
    // For now, we return a mock success with a dummy payment URL.
    
    // In a real scenario, you would call your crypto/payment provider here:
    // const providerResponse = await fetch('provider-api.com/pay', { ... });
    // const providerData = await providerResponse.json();
    
    const mockPaymentId = `EXT_${Date.now()}`;
    const mockPaymentUrl = `https://sagitarius.cc/claim/${processToken}`;

    return NextResponse.json({
      success: true,
      data: {
        id: mockPaymentId,
        url: mockPaymentUrl
      }
    });

  } catch (error: any) {
    console.error('Billgang Plugin Create Charge Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
