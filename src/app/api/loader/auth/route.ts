import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : null;
    const password = typeof body?.password === 'string' ? body.password : null;
    const hwid = typeof body?.hwid === 'string' ? body.hwid.trim() : null;

    if (!email || !password || !hwid) {
      return NextResponse.json(
        { success: false, message: 'Missing email, password, or HWID parameter.' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // 1. Authenticate with Supabase Auth using email & password
    const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authErr || !authData?.user) {
      return NextResponse.json(
        { success: false, message: authErr?.message || 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const userId = authData.user.id;

    // 2. Fetch User Profile
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      return NextResponse.json(
        { success: false, message: 'User profile not found.' },
        { status: 403 }
      );
    }

    // 3. Determine if the user has active subscription access
    let hasAccess = ['owner', 'admin', 'vip', 'super_vip', 'high_member'].includes(profile.role);

    if (!hasAccess) {
      // Check if they have an active key in software_keys table
      const { data: activeKeys, error: keysErr } = await supabase
        .from('software_keys')
        .select('id')
        .eq('created_by', userId)
        .eq('is_active', true)
        .or('expires_at.gt.now(),expires_at.is.null')
        .limit(1);

      if (activeKeys && activeKeys.length > 0) {
        hasAccess = true;
      }
    }

    if (!hasAccess) {
      return NextResponse.json(
        { success: false, message: 'No active subscription or license key found.' },
        { status: 403 }
      );
    }

    // 4. HWID Management (Commercial Auto-Lock)
    if (!profile.hwid || profile.hwid.trim() === '') {
      // Auto-lock HWID on first login! Fully automatic commercial workflow.
      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ hwid: hwid })
        .eq('id', userId);

      if (updateErr) {
        console.error('Failed to auto-lock HWID:', updateErr);
        return NextResponse.json(
          { success: false, message: 'Failed to bind HWID. Please try again.' },
          { status: 500 }
        );
      }
      profile.hwid = hwid;
    } else if (profile.hwid !== hwid) {
      // HWID Lock matches? If not, restrict access.
      return NextResponse.json(
        { success: false, message: 'HWID mismatch. Please request a reset on your profile dashboard.' },
        { status: 403 }
      );
    }

    // 5. Get a configured loader URL or return dynamic patcher
    const { data: fileData } = await supabase
      .from('software_files')
      .select('url')
      .eq('is_loader', true)
      .limit(1)
      .maybeSingle();

    const loaderUrl = fileData?.url || 'DYNAMIC_PATCHER';

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${profile.username || 'Subscriber'}!`,
      loader_url: loaderUrl,
      session_token: authData.session?.access_token || ''
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
