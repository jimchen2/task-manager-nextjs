import dbConnect from '../../../lib/dbConnect';
import DailyTasks from '../../../models/DailyTasks';

export default async function handler(req, res) {
  const { method } = req;
  const { date } = req.query;
  const { taskId } = req.body; // For PUT and DELETE operations on specific tasks

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const dailyTasks = await DailyTasks.findOne({ date: new Date(date) });
        if (!dailyTasks) {
          return res.status(404).json({ success: false, error: 'No tasks found for this date' });
        }
        res.status(200).json({ success: true, data: dailyTasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'POST':
      try {
        let dailyTasks = await DailyTasks.findOne({ date: new Date(date) });
        if (!dailyTasks) {
          dailyTasks = new DailyTasks({ date: new Date(date), tasks: [] });
        }
        const newTask = {
          title: req.body.task.title,
          deadline: req.body.task.deadline || new Date(date),
          details: req.body.task.details || '',
          tag: req.body.task.tag || 'other'
        };
        dailyTasks.tasks.push(newTask);
        await dailyTasks.save();
        res.status(201).json({ success: true, data: dailyTasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'PUT':
      try {
        const dailyTasks = await DailyTasks.findOne({ date: new Date(date) });
        if (!dailyTasks) {
          return res.status(404).json({ success: false, error: 'No tasks found for this date' });
        }
        const taskIndex = dailyTasks.tasks.findIndex(task => task._id.toString() === taskId);
        if (taskIndex === -1) {
          return res.status(404).json({ success: false, error: 'Task not found' });
        }
        dailyTasks.tasks[taskIndex] = { 
          ...dailyTasks.tasks[taskIndex], 
          title: req.body.task.title || dailyTasks.tasks[taskIndex].title,
          deadline: req.body.task.deadline || dailyTasks.tasks[taskIndex].deadline,
          details: req.body.task.details || dailyTasks.tasks[taskIndex].details,
          tag: req.body.task.tag || dailyTasks.tasks[taskIndex].tag
        };
        await dailyTasks.save();
        res.status(200).json({ success: true, data: dailyTasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    case 'DELETE':
      try {
        const dailyTasks = await DailyTasks.findOne({ date: new Date(date) });
        if (!dailyTasks) {
          return res.status(404).json({ success: false, error: 'No tasks found for this date' });
        }
        dailyTasks.tasks = dailyTasks.tasks.filter(task => task._id.toString() !== taskId);
        await dailyTasks.save();
        res.status(200).json({ success: true, data: dailyTasks });
      } catch (error) {
        res.status(400).json({ success: false, error: error.message });
      }
      break;

    default:
      res.status(400).json({ success: false, error: 'Invalid method' });
      break;
  }
}