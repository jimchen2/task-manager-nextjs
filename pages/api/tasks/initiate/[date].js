// pages/api/tasks/initiate/[date].js

import dbConnect from '../../../../lib/dbConnect';
import DailyTasks from '../../../../models/DailyTasks';

export default async function handler(req, res) {
  const { method } = req;
  const { date } = req.query; // This will be in the format YYYYMMDD

  console.log(`Received request for date: ${date}`);

  try {
    await dbConnect();
    console.log('Connected to database');

    if (method === 'GET') {
      console.log('Processing GET request');

      // First, check if the requested date already exists
      let dailyTasks = await DailyTasks.findOne({ date });

      if (dailyTasks) {
        console.log(`Found existing tasks for date: ${date}`);
        return res.status(200).json({ success: true, data: dailyTasks });
      }

      console.log(`No existing tasks found for date: ${date}. Looking back 7 days.`);

      // If not, look back up to 7 days
      const targetDate = new Date(date.slice(0, 4), parseInt(date.slice(4, 6)) - 1, date.slice(6));
      for (let i = 1; i <= 7; i++) {
        const prevDate = new Date(targetDate);
        prevDate.setDate(prevDate.getDate() - i);
        const prevDateString = prevDate.getFullYear().toString() +
                               (prevDate.getMonth() + 1).toString().padStart(2, '0') +
                               prevDate.getDate().toString().padStart(2, '0');
        
        console.log(`Checking date: ${prevDateString}`);
        const prevDailyTasks = await DailyTasks.findOne({ date: prevDateString });
        
        if (prevDailyTasks) {
          console.log(`Found tasks for previous date: ${prevDateString}. Copying to ${date}`);
          // If found, create a new entry for the target date with copied tasks
          dailyTasks = new DailyTasks({
            date: date,
            tasks: prevDailyTasks.tasks.map(task => ({
              title: task.title,
              deadline: date, // Set deadline to the target date
              details: task.details,
              tag: task.tag
            }))
          });
          await dailyTasks.save();
          console.log(`Saved copied tasks for date: ${date}`);
          return res.status(200).json({ success: true, data: dailyTasks, copied: true });
        }
      }

      console.log(`No tasks found in the past 7 days. Initializing empty entry for ${date}`);
      // If no tasks found in the past 7 days, create an empty entry
      dailyTasks = new DailyTasks({ date: date, tasks: [] });
      await dailyTasks.save();
      console.log(`Saved empty entry for date: ${date}`);
      return res.status(200).json({ success: true, data: dailyTasks, initialized: true });

    } else {
      console.log(`Unsupported method: ${method}`);
      res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error in handler:', error);
    res.status(400).json({ success: false, error: error.message });
  }
}