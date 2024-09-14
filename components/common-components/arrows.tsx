import React from 'react';
import ArrowThin from '../svg-components/arrow-thin';

type ArrowsPropTypes = {
    onUpArrowClick: () => void,
    onDownArrowClick: () => void,
    inset?: string,
    showUpArrow?: boolean,
    showDownArrow?: boolean
}

export default function Arrows({
    onUpArrowClick,
    onDownArrowClick,
    inset,
    showUpArrow=true,
    showDownArrow=true
} : ArrowsPropTypes) {
  return (
    <div
        className={`arrows 
        absolute z-30 ${inset ? inset : 'bottom-[2rem] right-[2rem]'} 
        max-lg:flex flex-col lg:hidden gap-4`}
      >
        {
          showUpArrow ?
          <div
            className='up-arrow w-full h-fit 
            p-2
            bg-columbia_blue 
            cursor-pointer'
            onClick={onUpArrowClick}
          >
            <ArrowThin/>
          </div> : <></>
        }
        {
          showDownArrow ?
          <div
            className='down-arrow w-full h-fit 
            p-2
            bg-columbia_blue 
            cursor-pointer'
            onClick={onDownArrowClick}
          >
            <ArrowThin downwards={true} />
          </div> : <></>
        }
      </div>
  )
}
