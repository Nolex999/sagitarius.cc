import { NextResponse } from 'next/server';

/**
 * Handle Webhooks from the actual payment provider (e.g., Forebit, Hoodpay).
 * This endpoint translates the provider's status into a Billgang-compatible format.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('Billgang Plugin Webhook Received from Provider:', body);

    // 1. Identify the ProcessToken and Status from the provider's body
    // This depends on the specific provider (Forebit, Hoodpay, etc.)
    const processToken = body.data?.processToken || body.metadata?.processToken;
    const providerStatus = body.status || body.data?.status;

    if (!processToken) {
      return NextResponse.json({ success: false, error: 'Missing processToken' }, { status: 400 });
    }

    // 2. Map provider status to Billgang status (PAID, PENDING, CANCELLED)
    let status = 'PENDING';
    if (['COMPLETED', 'PAID', 'SUCCESS', 'completed'].includes(providerStatus)) {
      status = 'COMPLETED';
    } else if (['CANCELLED', 'EXPIRED', 'failed'].includes(providerStatus)) {
      status = 'CANCELLED';
    }

    // 3. Normally, Billgang expects a specific response if it's polling, 
    // OR we might need to "ping" Billgang's WebhookCallbackUrl if we want to push.
    // However, the "webhookHandlingFlow" in the manifest tells Billgang how to 
    // PARSE the request we receive here if we redirect the provider to us.

    return NextResponse.json({
      success: true,
      data: {
        processToken,
        status
      }
    });

  } catch (error: any) {
    console.error('Billgang Plugin Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
