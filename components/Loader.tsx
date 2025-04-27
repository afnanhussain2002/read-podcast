import React from 'react'
import Star10 from './stars/s10'

const Loader = () => {
  return (
    <div className="flex items-center justify-center h-screen">
                <Star10 size={100} strokeWidth={4} className="animate-spin text-blue-500" />
              </div>
  )
}

export default Loader