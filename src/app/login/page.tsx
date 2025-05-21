'use client';

import { useEffect } from 'react';

export default function LoginPage() {
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_LINE_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_LINE_REDIRECT_URI;
    const state = crypto.randomUUID(); // CSRF対策
    const scope = 'profile openid email';

    const lineLoginUrl = new URL('https://access.line.me/oauth2/v2.1/authorize');
    lineLoginUrl.searchParams.set('response_type', 'code');
    lineLoginUrl.searchParams.set('client_id', clientId!);
    lineLoginUrl.searchParams.set('redirect_uri', redirectUri!);
    lineLoginUrl.searchParams.set('state', state);
    lineLoginUrl.searchParams.set('scope', scope);

    window.location.href = lineLoginUrl.toString();
  }, []);

  return <p>LINEログインにリダイレクト中...</p>;
}
