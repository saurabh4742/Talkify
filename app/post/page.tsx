"use client"
import { Button } from '@/components/ui/button';
// import axios from 'axios';
import React from 'react'

const page = () => {
    const createRoom = async () => {
        try {
          // const res = await axios.post("/api/getroom");
          
        } catch (error) {
        }
      };
  return (
    <div className='flex justify-center h-full items-center'><Button onClick={createRoom}>Room Create</Button></div>
  )
}

export default page