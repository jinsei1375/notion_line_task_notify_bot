import { sendLine } from '../../lib/line';
import { getTodayTasks } from '../../lib/notion';

export async function GET(request: Request) {
  if (request.method !== 'GET') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  }
  return new Response('OK', { status: 200 });
}
