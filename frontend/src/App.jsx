import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import Navbar from './components/common/Navbar'
import Signup from './pages/auth/Signup'
import Login from './pages/auth/Login'
import Home from './pages/Home/Home'


function App() {
  const {data:authUser, isLoading} = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await fetch('/api/auth/');
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok) {
          throw new Error(data.error || 'Something went wrong')
        }
        // console.log('authUser is here: ', data);
        return data;
      } catch (error) {
        throw new Error(error)
      }
    },
    retry: false
  })
  return (
    <>
        <Navbar/>
        <Routes>
          <Route path='/' element={authUser ? <Home/> : <Navigate to='/login' />}/>
          <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to='/' />}/>
          <Route path='/login' element={!authUser ? <Login/> : <Navigate to='/' />}/>
        </Routes>
    </>
  )
}

export default App
