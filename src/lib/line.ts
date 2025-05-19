export async function sendLine(text: string) {
  const LINE_API = 'https://api.line.me/v2/bot/message/push';
  const message = `本日期限のタスクは以下です。\n\n${text}`;
  const res = await fetch(LINE_API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: process.env.LINE_USER_ID,
      messages: [{ type: 'text', text: message }],
    }),
  });

  if (!res.ok) {
    const error = await res.text();
    console.error('LINE送信失敗:', error);
  }
}
