import React from 'react';
import Typography from './typography';

type ctaPropsTypes = {
  label: string,
  smallButton?: boolean
}

export default function CTA({
  label,
  smallButton
}: ctaPropsTypes) {
  return (
    <div
      className={`relative z-30
      flex items-center justify-center
      w-[12rem] h-[3rem]
      ${smallButton ? 'lg:w-[12rem] lg:h-[3.5rem]' : 'lg:w-[15.5rem] lg:h-[3.75rem] '}
      bg-black 
      border border-white
      rounded-full
      text-white
      cursor-pointer`}
    >
      <Typography 
        size={
          smallButton ? 'text-sm lg:text-base' : 'text-base lg:text-lg'
        }
      >
        {label}
      </Typography>
    </div>
  )
}
