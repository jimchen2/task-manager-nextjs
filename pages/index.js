import Head from "next/head";
import useTasks from "../hooks/useTasks";
import TaskSection from "../components/TaskSection";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorDisplay from "../components/ErrorDisplay";
import AddTaskButton from "../components/AddTaskButton";

export default function Today() {
  const date = new Date(
    new Date().toLocaleString("en-US", {
      timeZone: "Asia/Shanghai",
    })
  );
  const currentDate =
    date.getFullYear().toString() +
    (date.getMonth() + 1).toString().padStart(2, "0") +
    date.getDate().toString().padStart(2, "0");

  const { tasks, loading, error, fetchTasks, handleTasksChange } =
    useTasks(currentDate);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay message={error} />;

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="max-w-7xl mx-auto">
        <p className="text-xl mb-8">{currentDate}</p>
        <div className="space-y-12 font-semibold">
          <h2 className="text-xl mb-4">School</h2>
          <TaskSection
            title="School"
            tasks={tasks.school}
            onTasksChange={(updatedTasks) =>
              handleTasksChange("school", updatedTasks)
            }
            currentDate={currentDate}
          />
          <h2 className="text-xl mb-4">Personal</h2>
          <TaskSection
            title="Personal"
            tasks={tasks.personal}
            onTasksChange={(updatedTasks) =>
              handleTasksChange("personal", updatedTasks)
            }
            currentDate={currentDate}
          />
          <h2 className="text-xl mb-4">Other</h2>
          <TaskSection
            title="Other"
            tasks={tasks.other}
            onTasksChange={(updatedTasks) =>
              handleTasksChange("other", updatedTasks)
            }
            currentDate={currentDate}
          />
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <AddTaskButton onTaskAdded={fetchTasks} currentDate={currentDate} />
    </div>
  );
}
