import mongoose from 'mongoose';

// Define the Task sub-schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  deadline: {
    type: Date,
    required: true
  },
  details: {
    type: String,
    trim: true
  },
  tag: {
    type: String,
    enum: ['school', 'other', 'personal'],
    required: true
  }
});

// Define the DailyTasks schema
const dailyTasksSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    unique: true
  },
  tasks: [taskSchema]
});

// Create indexes for efficient querying
dailyTasksSchema.index({ date: 1 });

// Check if the model already exists before creating a new one
const DailyTasks = mongoose.models.DailyTasks || mongoose.model('DailyTasks', dailyTasksSchema);

export default DailyTasks;