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

    let binary: Buffer | null = null;

    const binaryPath = path.join(process.cwd(), 'private', 'Sagitarius.exe');
    if (fs.existsSync(binaryPath)) {
      binary = fs.readFileSync(binaryPath);
    } else {
      const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/software-files/templates/Sagitarius.exe`;
      try {
        const res = await fetch(storageUrl, { cache: 'no-store' });
        if (res.ok) {
          const arr = await res.arrayBuffer();
          binary = Buffer.from(arr);
        }
      } catch {}
    }

    if (!binary) {
      return NextResponse.json({ error: 'Binary not available. Upload Sagitarius.exe to storage/software-files/templates/' }, { status: 500 });
    }

    const fileName = `Sagitarius.exe`;

    return new NextResponse(new Uint8Array(binary), {
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
