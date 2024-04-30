import React, { useState,  useEffect, useRef } from 'react';
import { FaRegEdit, FaUser, FaHistory } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { CiSaveDown1 } from "react-icons/ci";
import { toast } from 'react-hot-toast'

import logo from '../../../public/img/logo.png';
import user from '../../../public/img/user.png';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const imageRef = useRef(null);

  const { data: authUser, refetch } = useQuery({ queryKey: ['authUser'] });

  const { mutate: logout, isPending, isError, error } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch('/api/auth/logout', {
          method: 'POST'
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
      } catch (error) {
        throw new Error(error)
      }
    },
    onSuccess: () => {
      toast.success('logout successfully');
      queryClient.invalidateQueries({queryKey: ['authUser']})
    }
  })

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // Check if the click occurred outside of the Navbar
      if (!imageRef.current.contains(event.target)) {
        console.log(imageRef);
        setIsOpen(false);
      }
    };

    // Attach event listener when the Navbar is open
    if (isOpen) {
      document.addEventListener('click', handleOutsideClick);
    }

    // Remove event listener when the Navbar is closed or unmounted
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className='' >
      <nav className='flex justify-between items-center shadow-lg px-2 font-light text-sm h-14'>
        <div className='flex justify-center items-center gap-5 w-[400px]'>
          <div className='w-14'>
            <img src={logo} alt="" />
          </div>
          <div className='w-2/4'>
            <input
              type="text"
              className='p-2 bg-gray-100 rounded-2xl focus:outline-none w-full hidden sm:flex'
              placeholder='Search here'
            />
          </div>
        </div>
        <div className='flex gap-10 items-center'>
          <div className='md:flex gap-2  items-center cursor-pointer hidden'>
            <FaRegEdit />
            <span className=''>Write</span>
          </div>
          {!authUser && (
            <div className='gap-5 hidden md:flex'>
              <Link to='signup' className='bg-green-500 rounded-lg p-1 text-white cursor-pointer'>Sign up</Link>
              <Link to='login' className='rounded-lg p-1 cursor-pointer'>Sign in</Link>
            </div>
          )}
          <div className='flex items-center gap-5'>
            <CiSearch className='text-2xl cursor-pointer sm:hidden' />
            <div ref={imageRef} onClick={toggleOpen} className='w-14 rounded-[10%] h-10 overflow-hidden cursor-pointer bg-gray-500'>
              <img src={user} alt="" className='w-full h-full object-cover' />
            </div>
          </div>
        </div>
      </nav>
      {isOpen && (
        <div className='border-2 border-black rounded absolute right-0 flex flex-col items-center py-2 w-[250px]'>
          {authUser ? (
            <div className=' w-full text-xl pl-2 flex flex-col gap-2 border-b-2 p-2'>
              <div className='flex items-center gap-2 text-gray-70'>
                <FaUser className='flex items-center gap-3' />
                <span>Profile</span>
              </div>
              <div className='flex items-center gap-3'>
                <CiSaveDown1 />
                <span>Saved</span>
              </div>
              <div className='flex items-center gap-3'>
                <FaHistory />
                <span>story</span>
              </div>
              <div
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                  refetch();
                  console.log(refetch())
                }}
                className='font-thin text-sm cursor-pointer'>
                <p>Sign out</p>
                <p >{authUser.email}</p>
              </div>
            </div>
          ) : (
            <div className='border-b-2 flex items-center flex-col w-full gap-3 p-2 z-50'>
              <h1>Get started on Medium</h1>
              <Link to='/signup' className='bg-green-500 w-[70%] text-center text-white p-2 rounded-2xl'>Sign up</Link>
              <Link to='/login' className='border-[1px] border-black bod w-[70%] text-center  p-2 rounded-2xl'>Sign in</Link>
              <div className='border-b-2 w-full flex justify-center items-center gap-5 text-xl p-2'>
                <FaRegEdit />
                <p>Write</p>
              </div>
            </div>

          )}

        </div>
      )}
    </div>
  );
}

export default Navbar;
