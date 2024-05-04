import React from 'react';

type TypographyProps = {
    isHeader?: boolean,
    children: React.ReactNode,
    size?: string
}

export default function Typography({
    isHeader,
    children,
    size
}: TypographyProps) {
  return (
    <>
        {
            isHeader ?
            <h2
                className='font-display text-8xl'
            >
                {
                    children
                }
            </h2> :
            <p
                className={`font-sans ${size || 'text-sm sm:text-base'}`}
            >
                {
                    children
                }
            </p>
        }
    </>
  )
}
