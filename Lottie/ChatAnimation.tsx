"use client"
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from "./ChatAnimation1.json"
export const ChatAnimation = () => {
  return (
    <div className='sm:w-5/12' >
      <Player src={animationData} loop  autoplay speed={0.5}  />
    </div>
  )
}
