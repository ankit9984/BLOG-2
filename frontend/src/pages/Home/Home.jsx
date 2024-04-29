import { useQuery } from '@tanstack/react-query'
import React from 'react'

function Home() {
  const {data: authUser} = useQuery({queryKey: ['authUser']})
  return (
    <div>
      {authUser.username}
    </div>
  )
}

export default Home
