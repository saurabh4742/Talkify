"use client"
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from "./BanAnimationPurple.json"
export const BanAnimation = () => {
  return (
    <div >
      <Player src={animationData} loop  autoplay speed={0.5}  />
    </div>
  )
}