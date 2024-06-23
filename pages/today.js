import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Today() {
  const [tasks, setTasks] = useState({
    school: [],
    personal: [],
    other: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const currentDate = new Date().toISOString().split('T')[0];
        const res = await fetch(`/api/tasks/${currentDate}`);
        const data = await res.json();
        
        if (data.success) {
          const groupedTasks = data.data.tasks.reduce((acc, task) => {
            acc[task.tag].push(task);
            return acc;
          }, { school: [], personal: [], other: [] });
          setTasks(groupedTasks);
        } else {
          setError('Failed to fetch tasks');
        }
      } catch (err) {
        setError('An error occurred while fetching tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-screen">Error: {error}</div>;

  const renderTaskTable = (taskList) => {
    return (
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deadline</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {taskList.map((task, index) => (
            <tr key={index}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{task.title}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.details || '-'}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(task.deadline).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Today's Tasks</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Today's Tasks</h1>
        <p className="text-xl mb-8">Date: {new Date().toISOString().split('T')[0]}</p>
        
        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-4">School:</h2>
            {tasks.school.length > 0 ? (
              <div className="overflow-x-auto">
                {renderTaskTable(tasks.school)}
              </div>
            ) : (
              <p className="text-gray-500">No school tasks for today.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Personal:</h2>
            {tasks.personal.length > 0 ? (
              <div className="overflow-x-auto">
                {renderTaskTable(tasks.personal)}
              </div>
            ) : (
              <p className="text-gray-500">No personal tasks for today.</p>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Other:</h2>
            {tasks.other.length > 0 ? (
              <div className="overflow-x-auto">
                {renderTaskTable(tasks.other)}
              </div>
            ) : (
              <p className="text-gray-500">No other tasks for today.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}