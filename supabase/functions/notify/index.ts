// supabase/functions/notify/index.ts

import { serve } from 'https://deno.land/std/http/server.ts';
import { format } from 'https://deno.land/x/date_fns/index.js';

serve(async (req) => {
  const notionApiKey = Deno.env.get('NOTION_API_KEY')!;
  const databaseId = Deno.env.get('NOTION_DATABASE_ID')!;
  const lineChannelAccessToken = Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')!;
  const lineUserId = Deno.env.get('LINE_USER_ID')!;
  const today = format(new Date(), 'yyyy-MM-dd');

  // Notion API から今日のタスクを取得
  const notionRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        property: '期限',
        date: { equals: today },
      },
    }),
  });

  const notionData = await notionRes.json();
  const tasks = notionData.results?.map((page: any) => {
    const title = page.properties['タスク名']?.title?.[0]?.plain_text || '無題';
    return `🔔 ${title}`;
  });

  if (!tasks || tasks.length === 0) {
    return new Response('今日のタスクはありません', { status: 200 });
  }

  // LINE Messaging API で通知
  const lineRes = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${lineChannelAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [
        {
          type: 'text',
          text: tasks.join('\n'),
        },
      ],
    }),
  });

  if (!lineRes.ok) {
    const error = await lineRes.text();
    console.error('LINE送信失敗:', error);
    return new Response('LINE通知に失敗しました', { status: 500 });
  }

  return new Response('通知を送信しました', { status: 200 });
});
