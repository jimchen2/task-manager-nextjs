import { useState, useEffect } from "react";

export default function useTasks(currentDate) {

  const [tasks, setTasks] = useState({
    school: [],
    personal: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/tasks/initiate/${currentDate}`);
      const data = await res.json();

      if (data.success) {
        const groupedTasks = data.data.tasks.reduce(
          (acc, task) => {
            acc[task.tag].push(task);
            return acc;
          },
          { school: [], personal: [], other: [] }
        );
        setTasks(groupedTasks);
      } else {
        setError("Failed to fetch tasks");
      }
    } catch (err) {
      setError("An error occurred while fetching tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleTasksChange = (category, updatedTasks) => {
    console.log("Updating tasks for category:", category);
    console.log("New tasks:", updatedTasks);
    setTasks((prevTasks) => {
      const newTasks = {
        ...prevTasks,
        [category]: updatedTasks,
      };
      console.log("New state:", newTasks);
      return newTasks;
    });
  };
  return { tasks, loading, error, fetchTasks, handleTasksChange };
}
