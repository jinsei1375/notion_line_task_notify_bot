import { sendLine } from '../src/app/lib/line';
import { getTodayTasks } from '../src/app/lib/notion';

export default async (req: any, res: any) => {
  if (req.method !== 'GET') {
    res.status(405).send('Method Not Allowed');
    return;
  }
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  }
  res.status(200).send('OK');
};
