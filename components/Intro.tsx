"use client"
import { ChatAnimation } from '@/Lottie/ChatAnimation'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'

const Intro = () => {
  const router=useRouter()
  return (
    <div className='sm:flex space-y-4 mt-4 w-full justify-center   items-center '>
        <ChatAnimation/>
        <div className='space-y-5 text-center'>
            <h1 className='sm:text-6xl text-backgroundGreen text-4xl font-bold'>Talkify</h1>
            <div className='w-full flex justify-center text-center text-[#14532D]'><p className='sm:text-3xl text-2xl w-8/12 '>Real-Time Video Conferencing Tool with Content Monitoring</p></div>
           <Button  onClick={()=>{
            router.push("/live")
           }} size="lg">Try Now!</Button>
            <div className='w-full'> <Button  variant="link" size="lg">Read More</Button></div>
        </div>
    </div>
  )
}

export default Intro
