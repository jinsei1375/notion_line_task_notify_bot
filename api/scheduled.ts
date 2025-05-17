import { sendLine } from '@/app/lib/line';
import { getTodayTasks } from '@/app/lib/notion';

export async function GET() {
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  }

  return new Response('OK');
}
