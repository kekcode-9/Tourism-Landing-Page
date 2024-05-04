import React from 'react';
import Link from 'next/link';
import constants from '@/utilities/constants';
import Typography from './typography';
import CTA from './cta';

export default function Navbar() {
  return (
    <div
      className='navbar
      fixed z-[100] top-0 left-0
      flex items-center justify-end
      w-screen h-fit py-8 px-16
      bg-white bg-opacity-[50%]
      border-b-[1px] border-b-white'
    >
      <div
        className='flex items-center justify-center gap-24
        text-dark_slate_gray'
      >
        {
          Object.entries(constants.NAV).map(([key, value]: [string, string], index: number) => {
            return (
              <Link key={key} href={value.toLowerCase()}>
                <Typography size='text-lg'>
                  {value}
                </Typography>
              </Link>
            )
          })
        }
        <CTA smallButton label={constants.PLAN_TRAVEL} />
      </div>
    </div>
  )
}
