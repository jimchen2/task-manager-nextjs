// components/AddTaskButton.js
import { useState } from "react";
import AddTaskModal from "./AddTaskModal";

export default function AddTaskButton({ onTaskAdded, currentDate }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleTaskAdded = () => {
    closeModal();
    if (onTaskAdded) {
      onTaskAdded();
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="fixed bottom-4 right-4 w-24 h-24 sm:w-20 sm:h-20 md:w-16 md:h-16 bg-blue-500 text-white rounded-full text-5xl sm:text-4xl md:text-3xl shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        +
      </button>
      {isModalOpen && (
        <AddTaskModal
          onClose={closeModal}
          onTaskAdded={handleTaskAdded}
          currentDate={currentDate}
        />
      )}
    </>
  );
}