import { useState } from 'react';
import EditTaskButton from './EditTaskButton';
import DeleteTaskButton from './DeleteTaskButton';

export default function TaskTable({ tasks: initialTasks, onTasksChange }) {
  const [tasks, setTasks] = useState(initialTasks);

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks for this category.</p>;
  }

  const handleDelete = async (deletedTask) => {
    const updatedTasks = tasks.filter(task => task._id !== deletedTask._id);
    setTasks(updatedTasks);
    if (onTasksChange) {
      onTasksChange(updatedTasks);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.details || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(task.deadline).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <EditTaskButton task={task} />
                <DeleteTaskButton task={task} onDelete={handleDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}