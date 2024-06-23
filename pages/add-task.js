import { useState } from 'react';
import Head from 'next/head';

export default function AddTask() {
  const [task, setTask] = useState({
    title: '',
    details: '',
    tag: 'school'
  });
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split('T')[0];
    
    try {
      const res = await fetch(`/api/tasks/${currentDate}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ task }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage('Task added successfully!');
        setTask({ title: '', details: '', tag: 'school' });
      } else {
        setMessage('Failed to add task. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prevTask => ({ ...prevTask, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Head>
        <title>Add New Task</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h2 className="text-3xl font-extrabold text-gray-900">Add New Task</h2>
                <p className="text-xl">Date: {new Date().toISOString().split('T')[0]}</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="title"
                    placeholder="Task Title"
                    value={task.title}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                  <textarea
                    name="details"
                    placeholder="Details (optional)"
                    value={task.details}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                  <select
                    name="tag"
                    value={task.tag}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="school">School</option>
                    <option value="personal">Personal</option>
                    <option value="other">Other</option>
                  </select>
                  <button type="submit" className="w-full px-4 py-2 text-white bg-cyan-500 rounded-md hover:bg-cyan-600">
                    Add Task
                  </button>
                </form>
                {message && (
                  <p className="mt-4 text-sm text-center text-green-600">
                    {message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}