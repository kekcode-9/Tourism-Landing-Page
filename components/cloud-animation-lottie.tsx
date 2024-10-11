"use client"
import React from 'react';
import Lottie from 'react-lottie';
import cloudLottie from '@/lotties/clouds-lottie.json';

export default function CloudAnimation() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: cloudLottie,
    rendererSettings: {
      preserveAspectRatio: 'none' // 'xMidYMid slice'
    }
  }

  return (
    <Lottie options={defaultOptions} style={{ width: '400', height: '400' }} />
  )
}
