// /app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

const LINE_CLIENT_ID = process.env.LINE_CLIENT_ID!;
const LINE_CLIENT_SECRET = process.env.LINE_CLIENT_SECRET!;
const LINE_REDIRECT_URI = process.env.LINE_REDIRECT_URI!;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.json({ error: 'Missing code' }, { status: 400 });
  }

  try {
    // トークン取得
    const tokenRes = await fetch('https://api.line.me/oauth2/v2.1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: LINE_REDIRECT_URI,
        client_id: LINE_CLIENT_ID,
        client_secret: LINE_CLIENT_SECRET,
      }),
    });
    const tokenData = await tokenRes.json();
    if (tokenData.error) {
      return NextResponse.json(tokenData, { status: 400 });
    }

    // プロフィール検証
    const profileRes = await fetch('https://api.line.me/oauth2/v2.1/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ access_token: tokenData.access_token }),
    });
    const profileData = await profileRes.json();
    if (profileData.error) {
      return NextResponse.json(profileData, { status: 400 });
    }

    // ここでSupabase登録とかやる予定

    return NextResponse.json({ message: 'ログイン成功', profile: profileData });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
