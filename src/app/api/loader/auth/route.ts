import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim() : null;
    const password = typeof body?.password === 'string' ? body.password : null;
    const hwid = typeof body?.hwid === 'string' ? body.hwid.trim() : null;
    const keyStr = typeof body?.key === 'string' ? body.key.trim() : null;

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

    // 3. Handle Key Redemption if key parameter is provided
    if (keyStr && keyStr !== '') {
      const { data: keyRecord, error: keyErr } = await supabase
        .from('software_keys')
        .select('*')
        .eq('key', keyStr)
        .eq('is_active', true)
        .maybeSingle();

      if (keyErr || !keyRecord) {
        return NextResponse.json(
          { success: false, message: 'Invalid or already claimed license key.' },
          { status: 400 }
        );
      }

      if (keyRecord.created_by && keyRecord.created_by !== userId) {
        return NextResponse.json(
          { success: false, message: 'This license key has already been claimed by another user.' },
          { status: 400 }
        );
      }

      // Claim the key by updating created_by and username metadata
      const updatedMetadata = {
        ...(keyRecord.metadata || {}),
        username: profile.username || 'Subscriber'
      };

      const { error: claimErr } = await supabase
        .from('software_keys')
        .update({
          created_by: userId,
          metadata: updatedMetadata
        })
        .eq('id', keyRecord.id);

      if (claimErr) {
        return NextResponse.json(
          { success: false, message: 'Failed to activate the license key. Try again.' },
          { status: 500 }
        );
      }
    }

    // 4. Determine if the user has active subscription access
    let hasAccess = ['owner', 'admin', 'vip', 'super_vip', 'high_member'].includes(profile.role);
    let subscriptionTime = 'Lifetime Access';

    if (!hasAccess) {
      // Check if they have an active key in software_keys table
      const { data: activeKeys, error: keysErr } = await supabase
        .from('software_keys')
        .select('expires_at, metadata')
        .eq('created_by', userId)
        .eq('is_active', true)
        .or('expires_at.gt.now(),expires_at.is.null')
        .limit(1);

      if (activeKeys && activeKeys.length > 0) {
        hasAccess = true;
        const key = activeKeys[0];
        if (key.expires_at) {
          const exp = new Date(key.expires_at);
          const diffMs = exp.getTime() - Date.now();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          const diffHours = Math.ceil(diffMs / (1000 * 60 * 60));
          if (diffDays > 1) {
            subscriptionTime = `${diffDays} days left`;
          } else {
            subscriptionTime = `${diffHours} hours left`;
          }
        } else {
          subscriptionTime = 'Active Subscription';
        }
      }
    }

    if (!hasAccess) {
      // Return custom status telling the C++ loader to ask for a key!
      return NextResponse.json(
        { success: false, need_key: true, message: 'No active subscription. Please enter a key to activate.' },
        { status: 403 }
      );
    }

    // 5. HWID Management (Commercial Auto-Lock)
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

    // 6. Get a configured loader URL or fall back to the file-server
    const { data: fileData } = await supabase
      .from('software_files')
      .select('url')
      .eq('is_loader', true)
      .limit(1)
      .maybeSingle();

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${req.headers.get('x-forwarded-proto') || 'http'}://${req.headers.get('host') || 'localhost:3000'}`;
    const sessionToken = authData.session?.access_token || '';
    const loaderUrl = `${baseUrl}/api/loader/download?token=${encodeURIComponent(sessionToken)}`;

    return NextResponse.json({
      success: true,
      message: `Welcome back, ${profile.username || 'Subscriber'}!`,
      loader_url: loaderUrl,
      session_token: authData.session?.access_token || '',
      expiry: subscriptionTime,
      avatar_url: profile.avatar_url || ''
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
