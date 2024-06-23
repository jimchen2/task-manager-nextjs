import { useState, useEffect } from "react";
import Head from "next/head";
import TaskTable from "../components/TaskTable";

export default function Today() {
  const [tasks, setTasks] = useState({
    school: [],
    personal: [],
    other: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const currentDate = new Date().toISOString().split("T")[0];
        const res = await fetch(`/api/tasks/${currentDate}`);
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

    fetchTasks();
  }, []);

  const handleTasksChange = (category, updatedTasks) => {
    setTasks(prevTasks => ({
      ...prevTasks,
      [category]: updatedTasks
    }));
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7xl mx-auto">
        <p className="text-xl mb-8">
          {new Date().toLocaleDateString("en-US", {
            timeZone: "Asia/Shanghai",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">School:</h2>
            <TaskTable tasks={tasks.school} onTasksChange={(updatedTasks) => handleTasksChange('school', updatedTasks)} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal:</h2>
            <TaskTable tasks={tasks.personal} onTasksChange={(updatedTasks) => handleTasksChange('personal', updatedTasks)} />
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Other:</h2>
            <TaskTable tasks={tasks.other} onTasksChange={(updatedTasks) => handleTasksChange('other', updatedTasks)} />
          </div>
        </div>
      </div>
    </div>
  );
}