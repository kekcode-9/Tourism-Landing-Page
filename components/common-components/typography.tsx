import React from 'react';

type TypographyProps = {
    isHeader?: boolean,
    children: React.ReactNode,
    size?: string,
    align?: string
}

export default function Typography({
    isHeader,
    children,
    size,
    align
}: TypographyProps) {
  return (
    <>
        {
            isHeader ?
            <h2
                className={`font-display ${size || 'text-8xl'}`}
            >
                {
                    children
                }
            </h2> :
            <p
                className={`font-sans ${size || 'text-sm sm:text-base'}
                ${align === "center" ? 'text-center' : 'text-left'}`}
            >
                {
                    children
                }
            </p>
        }
    </>
  )
}
