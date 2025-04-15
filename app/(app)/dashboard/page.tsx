import { useSession } from 'next-auth/react';
import React from 'react'

const Dashboard = () => {

      const { data: session } = useSession()
      const user = session?.user
    
      console.log(user, "user");
  return (
    <div>Dashboard</div>
  )
}

export default Dashboard