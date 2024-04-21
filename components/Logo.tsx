"use client"
import { useRouter } from 'next/navigation'
import React from 'react'

const Logo = () => {
  const router=useRouter()
  return (
    <div onClick={()=>{router.push("/")}} className='cursor-pointer hover:scale-105 text-2xl font-extrabold text-backgroundGreen'>Talkify</div>
  )
}

export default Logo