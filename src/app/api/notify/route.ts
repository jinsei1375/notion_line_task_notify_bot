import { sendLine } from '../../../lib/line';
import { getTodayTasks } from '../../../lib/notion';

export async function GET(request: Request) {
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  }
  return new Response('OK', { status: 200 });
}
