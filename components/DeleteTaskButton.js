// components/DeleteTaskButton.js
import { useState } from 'react';

export default function DeleteTaskButton({ task, onDelete, currentDate }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        const response = await fetch(`/api/tasks/${currentDate}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId: task._id }),
        });

        if (response.ok) {
          onDelete(task);
        } else {
          console.error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="ml-2 text-red-600 hover:text-red-900 disabled:opacity-50"
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}