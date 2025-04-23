import React from 'react'

interface FPEmailProps {
  email: string;
}

const ForgetPasswordEmail = ({email}: FPEmailProps)  => {
  return (
    <div>
    <h1>Welcome, {email}!</h1>
  </div>
  )
}
        
export default ForgetPasswordEmail