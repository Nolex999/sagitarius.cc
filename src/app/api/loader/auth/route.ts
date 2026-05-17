import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const hwid = typeof body?.hwid === 'string' ? body.hwid.trim() : null;

    if (!hwid) {
      return NextResponse.json(
        { success: false, message: 'Missing HWID parameter' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Call the authenticate_hwid RPC function in Supabase
    const { data: authResults, error: rpcErr } = await supabase.rpc(
      'authenticate_hwid',
      { p_hwid: hwid }
    );

    if (rpcErr) {
      console.error('Supabase Auth RPC Error:', rpcErr);
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

    if (!authResults || authResults.length === 0) {
      return NextResponse.json(
        { success: false, message: 'HWID not registered or subscription has expired' },
        { status: 403 }
      );
    }

    const result = authResults[0] as {
      success: boolean;
      message: string;
      loader_url?: string | null;
      session_token?: string | null;
    };

    return NextResponse.json({
      success: result.success,
      message: result.message,
      loader_url: result.loader_url || '',
      session_token: result.session_token || ''
    });

  } catch (err: unknown) {
    console.error('Loader API Auth Route Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json(
      { success: false, message },
      { status: 500 }
    );
  }
}
