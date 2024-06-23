import { useState } from 'react';

export default function DeleteTaskButton({ task, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        const date = new Date(task.deadline).toISOString().split('T')[0];
        const response = await fetch(`/api/tasks/${date}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ taskId: task._id }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            onDelete(task);
          } else {
            throw new Error(result.error || 'Failed to delete task');
          }
        } else {
          throw new Error('Failed to delete task');
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:text-red-900 disabled:opacity-50"
      disabled={isDeleting}
    >
      {isDeleting ? 'Deleting...' : 'Delete'}
    </button>
  );
}