"use client"
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from "./NotfoundPageanimation.json"
export const NotfoundPageAnimation = () => {
  return (
    <div >
      <Player src={animationData} loop  autoplay speed={0.5}  />
    </div>
  )
}