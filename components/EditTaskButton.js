export default function EditTaskButton({ task }) {
    const handleEdit = () => {
      // Implement edit functionality here
      console.log('Edit task:', task);
    };
  
    return (
      <button
        onClick={handleEdit}
        className="text-indigo-600 hover:text-indigo-900 mr-2"
      >
        Edit
      </button>
    );
  }