// supabase/functions/notify/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

serve(async () => {
  const notionApiKey = Deno.env.get('NOTION_API_KEY')!;
  const databaseId = Deno.env.get('NOTION_DATABASE_ID')!;
  const lineToken = Deno.env.get('LINE_CHANNEL_ACCESS_TOKEN')!;
  const lineUserId = Deno.env.get('LINE_USER_ID')!;

  const today = new Date().toISOString().split('T')[0];

  // Notion API から今日のタスクを取得
  const notionRes = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      filter: {
        property: '期限',
        date: {
          equals: today,
        },
      },
    }),
  });

  const data = await notionRes.json();
  const tasks = data.results
    .map((item: any) => item.properties.Name.title[0]?.plain_text)
    .filter(Boolean);

  if (tasks.length === 0) {
    return new Response('No tasks for today', { status: 200 });
  }

  const message = `📋 今日のタスク:\n- ${tasks.join('\n- ')}`;

  // LINE Messaging API で通知
  await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${lineToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: lineUserId,
      messages: [{ type: 'text', text: message }],
    }),
  });

  return new Response('OK', { status: 200 });
});
