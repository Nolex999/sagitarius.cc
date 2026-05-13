import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const application_id = searchParams.get('application_id');

    if (!application_id) {
      return NextResponse.redirect(new URL('/dashboard/support?error=no_id', request.url));
    }

    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.redirect(new URL('/auth/login?redirect=/dashboard/support', request.url));
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || !['admin', 'owner'].includes(profile.role)) {
      return NextResponse.redirect(new URL('/dashboard?error=forbidden', request.url));
    }

    // Reject the application
    const { data: app } = await supabase
      .from('reseller_applications')
      .select('user_id')
      .eq('id', application_id)
      .single();

    if (!app) {
      return NextResponse.redirect(new URL('/dashboard/support?error=not_found', request.url));
    }

    await supabase
      .from('reseller_applications')
      .update({
        status: 'rejected',
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', application_id);

    // Send notification to the user
    await supabase
      .from('inbox_messages')
      .insert({
        user_id: app.user_id,
        type: 'notification',
        title: '❌ Reseller Application Rejected',
        content: 'Unfortunately, your reseller application has been rejected. Please contact support for more information.'
      });

    return NextResponse.redirect(new URL('/dashboard/support?success=rejected', request.url));
  } catch (error: any) {
    return NextResponse.redirect(new URL('/dashboard/support?error=' + error.message, request.url));
  }
}