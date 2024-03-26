"use client"
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from "./ChatAnimation.json"
export const ChatAnimation = () => {
  return (
    <div >
      <Player src={animationData} loop  autoplay speed={0.5}  />
    </div>
  )
}
