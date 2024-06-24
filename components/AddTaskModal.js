// components/AddTaskModal.js
import { useState, useRef, useEffect } from "react";

export default function AddTaskModal({ onClose, onTaskAdded, currentDate }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [tag, setTag] = useState("other");
  const [deadline, setDeadline] = useState("");
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/tasks/${currentDate}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: {
            title,
            details,
            tag,
            deadline: deadline || currentDate,
          },
        }),
      });

      if (response.ok) {
        if (onTaskAdded) {
          onTaskAdded();
        } else {
          onClose();
        }
      } else {
        console.error("Failed to add task");
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center"
      id="my-modal"
    >
      <div
        ref={modalRef}
        className="relative p-5 border w-96 shadow-lg rounded-md bg-white"
      >
        <div className="mt-3 text-center">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Add New Task
          </h3>
          <form onSubmit={handleSubmit} className="mt-2">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="mt-2 p-2 w-full border rounded"
              required
            />
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Task Details"
              className="mt-2 p-2 w-full border rounded"
            />
            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="mt-2 p-2 w-full border rounded"
            >
              <option value="school">School</option>
              <option value="personal">Personal</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              placeholder="Deadline (YYYYMMDD)"
              className="mt-2 p-2 w-full border rounded"
              pattern="\d{8}"
              title="Please enter date in YYYYMMDD format"
            />
            <div className="items-center px-4 py-3">
              <button
                id="ok-btn"
                className="px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
                type="submit"
              >
                Add Task
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
