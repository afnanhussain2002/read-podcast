import React from 'react'
import Image from 'next/image'
import logo from '../public/logo.png'
import Link from 'next/link'

const Logo = () => {
  return (
    <Link href={"/"}>
    <Image src={logo} alt="logo" width={200} height={200} className='w-28 h-auto cursor-pointer rounded-md shadow-light dark:shadow-dark lg:w-48'/>
    
    </Link>
  )
}

export default Logo