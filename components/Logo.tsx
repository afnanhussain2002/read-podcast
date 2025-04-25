import React from 'react'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href={"/"}>
    <Image src={logo} alt="logo" width={100} height={100} className='cursor-pointer rounded-md'/>
    
    </Link>
  )
}

export default Logo