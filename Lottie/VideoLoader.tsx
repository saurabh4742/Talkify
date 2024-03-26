"use client"
import { Player } from '@lottiefiles/react-lottie-player'
import React from 'react'
import animationData from "./VideoLoader.json"
export const VideoLoader = () => {
  return (
    <div >
      <Player src={animationData} loop  autoplay   />
    </div>
  )
}