"use client";
import { useRef } from 'react';
import Image from 'next/image';
import { CldImage } from 'next-cloudinary';
import { motion } from 'framer-motion';
import GreenMountain from '@/public/green-mountain.jpg';
import NameSVG from '@/components/svg-components/name-svg';
import { CloudLeft, CloudRight } from '@/components/svg-components/clouds-svg';

export default function Home() {
  const MotionImage = motion(CldImage);
  const underlineRef = useRef<HTMLDivElement>(null);

  return (
    <div className='relative 
      flex items-center justify-center
      w-full h-full'
    >
      <CloudRight/>
      <NameSVG/>
      <CloudLeft/>
      <motion.div
        className='overlay-div
        absolute top-0 left-0 z-10
        w-full h-full
        bg-[#012B41] bg-opacity-35'
        initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 1,
            ease: 'easeOut'
          }
        }}
      />
      <MotionImage
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/references/tourism/vmlknxcqkc6tjbazxtr5"
        alt='green mountains of meghalaya'
        fill
        className='object-cover'
        quality={100}
        initial={{
          scale: 1.18,
          translateY: '-50px',
          transformOrigin: 'center',
          filter: 'blur(10px)'
        }}
        animate={{
          scale: 1,
          translateY: '0px',
          transformOrigin: 'center',
          filter: 'blur(0px)',
          transition: {
            duration: 3,
            ease: 'easeOut'
          }
        }}
      />
    </div>
  )
}
