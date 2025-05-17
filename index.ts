import { sendLine } from '@/app/lib/line';
import { getTodayTasks } from '@/app/lib/notion';

async function main() {
  const tasks = await getTodayTasks();
  if (tasks.length > 0) {
    console.log('📭 今日のタスク:', tasks);
    const message = tasks.map((t) => `🔔 ${t}`).join('\n');
    await sendLine(message);
  } else {
    console.log('📭 今日のタスクはありません');
  }
}

main().catch(console.error);
