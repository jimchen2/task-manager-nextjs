import TaskTable from "./TaskTable";

export default function TaskSection({ title, tasks, onTasksChange, currentDate }) {
  return (
    <div>
      <TaskTable tasks={tasks} onTasksChange={onTasksChange} currentDate={currentDate} />
    </div>
  );
}