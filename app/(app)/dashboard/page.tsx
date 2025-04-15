"use client"
import { useSession } from 'next-auth/react';
import React from 'react'

const Dashboard = () => {

      const { data: session } = useSession()
      const user = session?.user
    
      console.log(user, "user");
  return (
    <div className='min-h-screen'>Dashboard</div>
  )
}

export default Dashboard