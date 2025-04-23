import React from 'react'

interface FPEmailProps {
  firstName: string;
}

const ForgetPasswordEmail: React.FC<Readonly<FPEmailProps>> = ({firstName})  => {
  return (
    <div>
    <h1>Welcome, {firstName}!</h1>
  </div>
  )
}
        
export default ForgetPasswordEmail