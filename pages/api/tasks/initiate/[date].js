// pages/api/tasks/initiate/[date].js

import dbConnect from '../../../../lib/dbConnect';
import DailyTasks from '../../../../models/DailyTasks';
import { authMiddleware } from '../../../../middleware/authMiddleware';

async function handler(req, res) {
  const { method } = req;
  const { date } = req.query; // This will be in the format YYYYMMDD
  try {
    await dbConnect();

    if (method === 'GET') {
      let dailyTasks = await DailyTasks.findOne({ date });

      if (dailyTasks) {
        return res.status(200).json({ success: true, data: dailyTasks });
      }
      const targetDate = new Date(date.slice(0, 4), parseInt(date.slice(4, 6)) - 1, date.slice(6));
      for (let i = 1; i <= 7; i++) {
        const prevDate = new Date(targetDate);
        prevDate.setDate(prevDate.getDate() - i);
        const prevDateString = prevDate.getFullYear().toString() +
                               (prevDate.getMonth() + 1).toString().padStart(2, '0') +
                               prevDate.getDate().toString().padStart(2, '0');
        
        const prevDailyTasks = await DailyTasks.findOne({ date: prevDateString });
        
        if (prevDailyTasks) {
          dailyTasks = new DailyTasks({
            date: date,
            tasks: prevDailyTasks.tasks.map(task => ({
              title: task.title,
              deadline: task.deadline, 
              details: task.details,
              tag: task.tag
            }))
          });
          await dailyTasks.save();
          return res.status(200).json({ success: true, data: dailyTasks, copied: true });
        }
      }
      dailyTasks = new DailyTasks({ date: date, tasks: [] });
      await dailyTasks.save();
      return res.status(200).json({ success: true, data: dailyTasks, initialized: true });

    } else {
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}

export default authMiddleware(handler);
