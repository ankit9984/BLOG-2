import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import toast from 'react-hot-toast';

function SaveStories() {
  const queryClient = useQueryClient();
  const { data: authUser, isLoading } = useQuery({ queryKey: ['authUser'] });
  const [selectedStatus, setSelectedStatus] = useState('draft');

  const handleStatusChange = (status) => {
    // console.log(status);
    setSelectedStatus(status)
  }

  const handleDelete = async (postId) => {
    try {
      const response = await fetch(`/api/posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`, // Assuming you have an access token for authentication
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
  
      const deletedPost = await response.json();
      toast.success('Post deleted successfully!');
      
      // Update the UI to reflect the deletion
      queryClient.setQueryData(['authUser'], (oldData) => {
        const updatedPosts = oldData.posts.filter((post) => post._id !== deletedPost._id);
        return { ...oldData, posts: updatedPosts };
      });
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post!');
    }
  };
  
  

  const filteredPosts = authUser && authUser.posts.filter(post => post.status === selectedStatus)

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <h1 className='text-3xl font-bold pb-5'>Your Stories</h1>
      <div className='flex gap-6 mb-6'>
        <button
          className={`text-gray-600 ${selectedStatus === 'draft' ? 'font-bold' : ''}`}
          onClick={() => handleStatusChange('draft')}>
          Drafts
        </button>
        <button
          className={`text-gray-600 ${selectedStatus === 'public' ? 'font-bold' : ''}`}
          onClick={() => handleStatusChange('public')}>
          Published
        </button>
      </div>
      <div className='w-full max-w-lg'>
        {filteredPosts && filteredPosts.map(post => (
          <div key={post._id} className='bg-white shadow-md rounded-md p-4 mb-4 flex justify-between items-center'>
            <div>
              <h2 className='text-xl font-semibold mb-2'>{post.title}</h2>
              <p className='text-gray-700'>{post.content}</p>
              <div className='flex justify-between text-gray-500 mt-2'>
                {selectedStatus === 'draft' ? (
                  <p>{new Date(post.updatedAt).toLocaleString()}</p>
                ) : (
                  <p>Updated: {new Date(post.updatedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
            <div className='text-2xl '>
                <MdDelete onClick={() => handleDelete(post._id)} className='cursor-pointer text-4xl pb-2'/>
                <FaEdit className='cursor-pointer'/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SaveStories;
