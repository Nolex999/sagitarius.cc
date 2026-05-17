import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');

  if (!token) {
    return NextResponse.json({ error: 'Missing token' }, { status: 401 });
  }

  try {
    const supabase = await createClient();

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);

    if (authErr || !user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    const hasAccess = profile && ['owner', 'admin', 'vip', 'super_vip', 'high_member'].includes(profile.role);

    if (!hasAccess) {
      const { data: activeKeys } = await supabase
        .from('software_keys')
        .select('id')
        .eq('created_by', user.id)
        .eq('is_active', true)
        .or('expires_at.gt.now(),expires_at.is.null')
        .limit(1);

      if (!activeKeys || activeKeys.length === 0) {
        return NextResponse.json({ error: 'No active subscription' }, { status: 403 });
      }
    }

    const binaryPath = path.join(process.cwd(), 'private', 'trinity.exe');

    if (!fs.existsSync(binaryPath)) {
      return NextResponse.json({ error: 'Binary not found on server' }, { status: 500 });
    }

    const binary = fs.readFileSync(binaryPath);
    const fileName = `trinity-${Date.now()}.exe`;

    return new NextResponse(binary, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': binary.length.toString(),
        'Cache-Control': 'no-store, private',
      },
    });
  } catch (err) {
    console.error('Download error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
