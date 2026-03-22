import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { patchLoader } from '@/lib/loader-patcher';
import path from 'path';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const keyStr = searchParams.get('key');

  if (!keyStr) {
    return NextResponse.json({ error: 'Missing key parameter' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    
    // 1. Verify key in database
    const { data: keyData, error: keyErr } = await supabase
      .from('software_keys')
      .select('*, software_categories(name)')
      .eq('key', keyStr)
      .eq('is_active', true)
      .single();

    if (keyErr || !keyData) {
      return NextResponse.json({ error: 'Invalid or inactive license key' }, { status: 403 });
    }

    // 2. Locate template loader
    const templatePath = path.join(process.cwd(), 'public', 'bin', 'TrinityLoader.exe');
    
    // 3. Patch the loader with the unique key
    const patchedBinary = await patchLoader(templatePath, keyStr);

    // 4. Return as download
    const fileName = `Sagitarius_${(keyData as any).software_categories?.name || 'Loader'}_${keyStr.slice(-4)}.exe`;
    
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
