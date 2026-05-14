import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { discord, telegram, website, details } = await request.json();
    const userId = session.user.id;

    // Check if already reseller
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (existingProfile?.role === 'reseller') {
      return NextResponse.json({ success: false, message: 'You are already a reseller' }, { status: 400 });
    }

    // Check for pending application
    const { data: existingApp } = await supabase
      .from('reseller_applications')
      .select('id')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingApp) {
      return NextResponse.json({ success: false, message: 'You already have a pending application' }, { status: 400 });
    }

    // Create application
    const { data: app, error } = await supabase
      .from('reseller_applications')
      .insert({
        user_id: userId,
        discord: discord || null,
        telegram: telegram || null,
        website: website || null,
        details: details || null
      })
      .select('id')
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: 'Application submitted successfully',
      application_id: app.id
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}