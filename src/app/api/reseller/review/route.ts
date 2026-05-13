import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

const DISCORD_WEBHOOK = process.env.DISCORD_RESELLER_WEBHOOK || 'https://discord.com/api/webhooks/1484671996305473658/H1olggHdDLVKmxd-8-P7Pl8Gz7MqWkF9GxddorvfRDxupSXm5SDVW3lEnGtz1HHYW8EY';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://sagitarius.cc';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (!profile || !['admin', 'owner'].includes(profile.role)) {
      return NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 });
    }

    const { application_id, approved, notes } = await request.json();

    const { data: app, error: appError } = await supabase
      .from('reseller_applications')
      .select('*, user:profiles!inner(email, username)')
      .eq('id', application_id)
      .single();

    if (appError || !app) {
      return NextResponse.json({ success: false, message: 'Application not found' }, { status: 404 });
    }

    if (approved) {
      await supabase
        .from('profiles')
        .update({ role: 'reseller' })
        .eq('id', app.user_id);
    }

    await supabase
      .from('reseller_applications')
      .update({
        status: approved ? 'approved' : 'rejected',
        notes: notes || null,
        reviewed_by: session.user.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', application_id);

    const statusEmbed = {
      embeds: [{
        title: `Reseller Application ${approved ? '✅ Approved' : '❌ Rejected'}`,
        color: approved ? 0x22c55e : 0xef4444,
        fields: [
          { name: 'User', value: `**${app.user?.username || 'Unknown'}**\n${app.user?.email}`, inline: true },
          { name: 'Discord', value: app.discord || 'N/A', inline: true },
          { name: 'Telegram', value: app.telegram || 'N/A', inline: true },
          { name: 'Notes', value: notes || 'No notes', inline: false },
          { name: 'Reviewed by', value: session.user.email, inline: true }
        ],
        timestamp: new Date().toISOString(),
        footer: { text: 'Sagitarius.cc Reseller System' }
      }]
    };

    await fetch(DISCORD_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(statusEmbed)
    });

    return NextResponse.json({ success: true, message: approved ? 'Application approved' : 'Application rejected' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}