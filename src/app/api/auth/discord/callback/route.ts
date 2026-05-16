import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const DISCORD_CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const DISCORD_CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.NEXT_PUBLIC_BASE_URL 
  ? `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/discord/callback`
  : 'http://localhost:3000/api/auth/discord/callback';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(new URL('/dashboard/software?discord_linked=false', request.url));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/dashboard/software?discord_linked=false', request.url));
  }

  try {
    const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    const userResponse = await fetch('https://discord.com/api/users/@me', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to get Discord user');
    }

    const discordUser = await userResponse.json();

    return NextResponse.redirect(new URL('/dashboard/software?discord_linked=true&discord_id=' + discordUser.id, request.url));
  } catch (err) {
    console.error('Discord OAuth error:', err);
    return NextResponse.redirect(new URL('/dashboard/software?discord_linked=false', request.url));
  }
}