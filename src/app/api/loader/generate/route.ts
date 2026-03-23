import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { patchLoader, patchLoaderFromBuffer } from '@/lib/loader-patcher';
import { FACEIT_LOADER_BASE64, EXTERNAL_LOADER_BASE64 } from '@/assets/loaders';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyStr = searchParams.get('key');

  if (!keyStr) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    
    // 1. Verify key using the RPC (Same logic as the loader)
    const { data: verifyResults, error: rpcErr } = await supabase.rpc('verify_software_key', { p_key: keyStr });

    if (rpcErr || !verifyResults || verifyResults.length === 0 || !verifyResults[0].success) {
      const errorMsg = verifyResults?.[0]?.message || 'Invalid or inactive license key';
      return NextResponse.json({ error: errorMsg }, { status: 403 });
    }

    const keyData = verifyResults[0];
    const softwareName = (keyData.software_name || '').toLowerCase();
    
    // 2. Select the correct Base64 loader (Faceit vs External)
    const base64 = softwareName.includes('faceit') ? FACEIT_LOADER_BASE64 : EXTERNAL_LOADER_BASE64;
    const binary = Buffer.from(base64, 'base64');
    
    // 3. Patch the loader FROM MEMORY
    const patchedBinary = await patchLoaderFromBuffer(binary, keyStr);

    // 4. Return as download with a random name for stealth
    const randomName = Array.from({ length: 12 }, () => 
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random() * 62)]
    ).join('');

    const fileName = `${randomName}.exe`;
    
    return new NextResponse(new Uint8Array(patchedBinary), {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache'
      }
    });

  } catch (err: any) {
    console.error('Loader Generation Error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}
