import React from 'react'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href={"/"}>
    <Image src={logo} alt="logo" width={200} height={200} className='cursor-pointer rounded-md shadow-light dark:shadow-dark'/>
    
    </Link>
  )
}

export default Logo