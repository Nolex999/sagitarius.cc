import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('Authorization');
    const expectedKey = process.env.BILLGANG_API_KEY; // Using the existing key as a simple auth check

    if (!authHeader || authHeader !== `Bearer ${expectedKey}`) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // This is a simple validation endpoint required by the "setupExternalFlow"
    return NextResponse.json({ success: true, message: 'API Key is valid' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
