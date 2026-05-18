import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sagitarius.cc';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const STORAGE_BASE = `${SUPABASE_URL}/storage/v1/object/public/software-files/templates`;

function resolveUrl(url: string | null, fallback: string): string {
  if (!url) return fallback;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  if (url.startsWith('/')) return `${BASE_URL}${url}`;
  return url;
}

export async function GET() {
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();

    const [bootstrapperRes, loaderRes] = await Promise.all([
      supabase
        .from('bootstrapper_versions')
        .select('version, download_url, checksum, is_mandatory, release_notes')
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('loader_versions')
        .select('version, download_url, checksum, is_mandatory, release_notes')
        .order('created_at', { ascending: false })
        .limit(1),
    ]);

    const bs = bootstrapperRes.data?.[0] || null;
    const ldr = loaderRes.data?.[0] || null;

    return NextResponse.json({
      bootstrapper: bs ? {
        version: bs.version,
        url: resolveUrl(bs.download_url, `${STORAGE_BASE}/SagSetup.exe`),
        sha256: bs.checksum || '',
        is_mandatory: bs.is_mandatory,
        release_notes: bs.release_notes || '',
      } : null,
      loader: ldr ? {
        version: ldr.version,
        url: resolveUrl(ldr.download_url, `${STORAGE_BASE}/SagitariusLoader.exe`),
        sha256: ldr.checksum || '',
        is_mandatory: ldr.is_mandatory,
        release_notes: ldr.release_notes || '',
      } : null,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to fetch manifest' }, { status: 500 });
  }
}
