import { sendLine } from '@/app/lib/line';
import { getTodayTasks } from '@/app/lib/notion';

export const config = {
  schedule: '0 17 * * *', // JST 17時（UTC 8時）
  runtime: 'edge',
};

export default async function handler() {
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  }

  return new Response('OK');
}
