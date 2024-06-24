import { useState, useMemo } from "react";
import DeleteTaskButton from "./DeleteTaskButton";

export default function TaskTable({ tasks: initialTasks, onTasksChange, currentDate }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [expandedTask, setExpandedTask] = useState(null);

  // Sort tasks by title alphabetically
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => a.title.localeCompare(b.title));
  }, [tasks]);

  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks for this category.</p>;
  }

  const handleDelete = async (deletedTask) => {
    const updatedTasks = tasks.filter((task) => task._id !== deletedTask._id);
    setTasks(updatedTasks);
    if (onTasksChange) {
      onTasksChange(updatedTasks);
    }
  };

  const handleEdit = (editedTask) => {
    const updatedTasks = tasks.map((task) =>
      task._id === editedTask._id ? editedTask : task
    );
    setTasks(updatedTasks);
    if (onTasksChange) {
      onTasksChange(updatedTasks);
    }
  };

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength);
  };

  const toggleExpandTask = (task) => {
    setExpandedTask(expandedTask === task ? null : task);
  };

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full table-fixed divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="w-1/4 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
            <th className="w-1/8 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {sortedTasks.map((task) => (
            <tr key={task._id}>
              <td className="px-6 py-4 text-sm font-medium text-gray-900">
                {truncateText(task.title, 10)}
                {task.title.length > 10 && (
                  <button 
                    onClick={() => toggleExpandTask(task)}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                  >
                    ...more
                  </button>
                )}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div>
                  {truncateText(task.details || "-", 10)}
                  {task.details && task.details.length > 10 && (
                    <button 
                      onClick={() => toggleExpandTask(task)}
                      className="ml-2 text-blue-500 hover:text-blue-700"
                    >
                      ...more
                    </button>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">{task.deadline}</td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <DeleteTaskButton task={task} onDelete={handleDelete} currentDate={currentDate} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {expandedTask && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={() => setExpandedTask(null)}>
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" onClick={e => e.stopPropagation()}>
            <div className="mt-3 text-center">
              <h3 className="text-lg leading-6 font-medium text-gray-900">{expandedTask.title}</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-gray-500">
                  {expandedTask.details}
                </p>
              </div>
              <div className="items-center px-4 py-3">
                <button
                  onClick={() => setExpandedTask(null)}
                  className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}