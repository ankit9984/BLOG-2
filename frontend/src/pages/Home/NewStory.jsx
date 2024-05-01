import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

function NewStory() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('public'); // Default status is 'public'

  const queryClient = useQueryClient();

  const { mutate: postStory, isPending, isError, error } = useMutation({
    mutationFn: async ({ title, content, status }) => {
      try {
        const res = await fetch('/api/posts/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ title, content, status }), // Include status in the request body
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong');
        }
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      toast.success('Post successfully');
      queryClient.invalidateQueries({ queryKey: ['authUser'] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    postStory({ title, content, status }); // Include status when calling postStory
    // You can handle form submission logic here
    console.log(title);
  };

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <div className="mt-1">
            <input
              id="title"
              name="title"
              type="text"
              autoComplete="off"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="mt-1">
            <textarea
              id="content"
              name="content"
              rows="5"
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            name="status"
            className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="draft">Draft</option>
            <option value="public">Public</option>
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default NewStory;
