"use client"
import { Button } from '@/components/ui/button'
import { MonitorPlay } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const Page = () => {
  const [matching, setMatching] = useState(false);
    const router=useRouter()
  const startMatchmaking = () => {
    // Logic to start matchmaking goes here
    setMatching(true);
    router.push("/live")
    
  }

  return (
    <div className='flex flex-col h-[90vh] justify-center items-center gap-4'>
      <h1 className="text-3xl font-bold text-center mb-4">Welcome to Talkify!</h1>
      <p className="text-lg text-center mb-8 sm:w-4/12 p-2">
        Talkify is a platform where you can connect with random users for engaging conversations. Click the button below to start matching with a new conversation partner.
      </p>
      <Button size="lg" disabled={matching} onClick={startMatchmaking}>
        <MonitorPlay className='mr-2'/> {matching ? "Matching..." : "Start Matching Now"}
      </Button>
    </div>
  )
}

export default Page
