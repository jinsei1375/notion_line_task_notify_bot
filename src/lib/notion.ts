import { format } from 'date-fns';
import 'dotenv/config';

export async function getTodayTasks(): Promise<string[]> {
  const notionApiKey = process.env.NOTION_API_KEY!;
  const databaseId = process.env.NOTION_DATABASE_ID!;
  const today = format(new Date(), 'yyyy-MM-dd');

  const res = await fetch(`https://api.notion.com/v1/databases/${databaseId}/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${notionApiKey}`,
      'Notion-Version': '2022-06-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filter: {
        property: '期限', // タスクの期日プロパティ名
        date: {
          equals: today,
        },
      },
    }),
  });

  const data = await res.json();
  const tasks = data.results.map((page: any) => {
    const titleProp = page.properties['タスク名']; // タスク名プロパティ
    const text = titleProp?.title?.[0]?.plain_text ?? '(無題)';
    return `「${text}」`;
  });

  return tasks;
}
