import { NextApiRequest, NextApiResponse } from 'next';
import { sendLine } from '../lib/line';
import { getTodayTasks } from '../lib/notion';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  }
  response.status(200).json({ message: 'OK' });
}
