import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { patchLoaderFromBuffer } from '@/lib/loader-patcher';
import { R6_LOADER_BASE64, EXTERNAL_LOADER_BASE64 } from '@/assets/loaders';

export const runtime = 'nodejs';

function selectLoaderBase64(categoryName: string | null | undefined): string {
  const n = (categoryName || '').toLowerCase();
  return (n.includes('siege') || n.includes('r6')) ? R6_LOADER_BASE64 : EXTERNAL_LOADER_BASE64;
}

function randomExeName(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  for (let i = 0; i < 12; i++)
    s += chars[Math.floor(Math.random() * chars.length)];
  return `${s}.exe`;
}

async function patchAndRespond(keyStr: string): Promise<NextResponse> {
  const supabase = await createClient();

  const { data: verifyResults, error: rpcErr } = await supabase.rpc(
    'verify_software_key',
    { p_key: keyStr }
  );

  if (
    rpcErr ||
    !verifyResults ||
    verifyResults.length === 0 ||
    !verifyResults[0].success
  ) {
    const errorMsg =
      verifyResults?.[0]?.message || 'Invalid or inactive license key';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }

  const row = verifyResults[0] as {
    loader_url?: string | null;
    category_name?: string | null;
    message?: string;
  };

  if (row.message === 'casino_key') {
    return NextResponse.json(
      { error: 'Use the casino product selection first.' },
      { status: 400 }
    );
  }

  if (!row.loader_url) {
    return NextResponse.json(
      { error: 'No loader configured for this product.' },
      { status: 403 }
    );
  }

  const base64 = selectLoaderBase64(row.category_name);
  const binary = Buffer.from(base64, 'base64');
  const patchedBinary = await patchLoaderFromBuffer(binary, keyStr);
  const fileName = randomExeName();

  return new NextResponse(new Uint8Array(patchedBinary), {
    status: 200,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store',
    },
  });
}

export async function GET(req: NextRequest) {
  const keyStr = new URL(req.url).searchParams.get('key');
  if (!keyStr) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }
  try {
    return await patchAndRespond(keyStr);
  } catch (err: unknown) {
    console.error('Loader Generation Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    let keyStr: string | null = null;
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await req.json();
      keyStr = typeof body?.key === 'string' ? body.key : null;
    } else if (ct.includes('application/x-www-form-urlencoded')) {
      const form = await req.formData();
      keyStr = (form.get('key') as string) || null;
    }
    if (!keyStr?.trim()) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 });
    }
    return await patchAndRespond(keyStr.trim());
  } catch (err: unknown) {
    console.error('Loader Generation Error:', err);
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
