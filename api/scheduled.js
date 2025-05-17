const { sendLine } = require('../src/app/lib/line');
const { getTodayTasks } = require('../src/app/lib/notion');

module.exports = async (req, res) => {
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
