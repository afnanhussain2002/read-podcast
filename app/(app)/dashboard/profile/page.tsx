"use client"
import { useSession } from 'next-auth/react';
import Image from 'next/image'
import React from 'react'

const Profile = () => {
    
          const { data: session, status } = useSession()
          const user = session?.user
    
          if (status === 'loading') {
            return (
              <div className="min-h-screen flex items-center justify-center">
                <div className="bg-white border-4 border-black p-6 rounded-lg shadow-neobrutalism text-center animate-pulse">
                  <p className="text-lg font-bold">Loading Dashboard...</p>
                </div>
              </div>
            );
          }
  return (
      <div className="min-h-screen p-10 flex items-center justify-center">
        <div className="bg-brand-glow border-4 border-black p-8 rounded-xl w-full max-w-md text-black space-y-4">
          <div className="flex items-center space-x-4">
            <div className="border-4 border-black rounded-full overflow-hidden w-24 h-24">
              <Image
                src={user?.profileImage || ""}
                alt="Profile"
                width={96}
                height={96}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Welcome Back!</h1>
              <p className="font-mono text-sm">{user?.email}</p>
            </div>
          </div>
    
          <div className="border-t-4 border-black pt-4">
            <p className="font-semibold text-sm">User ID:</p>
            <code className="bg-white p-2 rounded-lg border-2 border-black block break-all">
              {user?.id}
            </code>
          </div>
        </div>
      </div>
  )
}

export default Profile