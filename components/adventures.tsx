import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import { CldImage } from 'next-cloudinary';
import gsap from 'gsap';
import { TourismContext } from '@/store/tourismStore';
import Arrows from './common-components/arrows';
import { ACTIONS } from '@/store/actions';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import constants from '@/utilities/constants';
import Typography from './common-components/typography';

gsap.registerPlugin(ScrollTrigger);

const { ADVENTURES } = constants;

const { TOGGLE_SHOW_ADVENTURES, SET_PLACES_SCROLL_POS } = ACTIONS;

export default function Adventures() {
  const [currAdventure, setCurrAdventure] = useState(0);

  const { dispatch } = useContext(TourismContext);

  const adventuresRef = useRef<HTMLDivElement>(null);
  const imgRefsArr = useRef<(HTMLDivElement | null)[]>([]);
  const pageRef = useRef<HTMLDivElement>(null);

  const getScrollTriggerStart = () => {
    const width = window.innerWidth;
    if (width < 1536 && width > 1024) {
      return '100% bottom';
    } else {
      return '50% 40%';
    }
  }
  
  useLayoutEffect(() => {
    let lastI = 0;

    let ctx = gsap.context(() => {
      imgRefsArr.current && new Array(6).fill("").map((item, i) => {
        gsap.to(imgRefsArr.current[i], {
          scrollTrigger: {
            scroller: adventuresRef.current,
            trigger: imgRefsArr.current[i],
            pin: imgRefsArr.current[i],
            /**
             * without pinType: 'fixed' you'll notice a jitter during the scroll.
             * Solution idea:
             * most modern browsers handle scrolling on a totally different thread. 
             * In cases like this because you CANNOT synchronize things. So ScrollTrigger 
             * is accurately setting the transform values to make the element appear "stuck" 
             * (fixed) but the browser is moving the WHOLE page for the scroll briefly before 
             * it renders the changes that ScrollTrigger made via the main JS thread. 
             * One thing that could solve this in your case is to use position: fixed for the 
             * pinning so that things are totally taken out of the scrolling context. By 
             * default, however, ScrollTrigger only uses position: fixed for pinning when 
             * the scroller is the <body>/<html>. You created a wrapper <div>, though. Once 
             * you start nesting things, position: fixed often isn't viable because if there 
             * are any transforms (even transform: translate(0px, 0px)) or will-change: transform, 
             * it creates a new rendering context in the browser and descendant elements will 
             * move with that element even if position: fixed is applied! Weird, I know. 
             * Technically it's proper behavior but almost nobody thinks that's intuitive 
             */
            pinType: 'fixed',
            pinSpacing: true,
            anticipatePin: 1,
            /**
             * one important thing about the scroller's marker:
             * When we say  60% ( for scroller's start marker ), it means 60% of the scroller's height from the top
             * of the scroller. Now, although we have specified our scroller's height as 100vh, the overflow-scroll style
             * makes sure that the height of the scroller is always acommodating of the heights of the items inside the
             * scroller and any gaps, paddings, margins around those items. So, when the viewport height is large enough
             * such that the scroller can take the viewport height and still acommodate all its inner content, then the
             * scroller will take the viewport height. But if the viewport height is smaller than the room needed by the
             * scroller to acommodate its content then the scroller will assume a height closer to the viewport height but
             * still large enoguh to fit all its content and spaces in.
             * For example: In our case where the images have a min height of 500px, when the viewport height is large,
             * i.e., above 1000px for a devices with min width 640px then the height of the scroller takes after the height
             * of the viewport but if the device height is less for the same min width of 640px then the height of the
             * scroller will remain at 1000px. This changes when the device width is smaller than 640px and then the scroller
             * height will again take after the device height.
             * 
             * Where the issue arises. The start marker for the scroller is always computed based on the height of the scroller.
             * When the height of the scroller is larger than the viewport height, the scroller's marker positions are still
             * based on the scroller height and not the viewport height. So as the device height keeps getting shorter ( give 
             * the scroller height remains larger than the viewport ), the markers for the scroller will appear to get closer
             * and closer to the bottom of the viewport since the marker position doesn't change with the device height but
             * with the scroller's height, the gap of which from the device height keeps getting higher as long as the device
             * width stays => 640px and its height keep reducing below 1000px.
             */
            start: window && getScrollTriggerStart(),
            end: '140% 10%',
            markers: true,
            // scrub: (i && i<5) ? true : false,
            // onEnter onLeave onEnterBack onLeaveBack
            toggleActions: 'play reverse play reverse',
            onEnter: () => {
              // to prevent index jump where the next index has a gap of more than 1 with the last index
              if (Math.abs(lastI - i) === 1) {
                setCurrAdventure(i);
                lastI = i;
              }
            },
            onEnterBack: () => {
              if (Math.abs(lastI - i) === 1)  {
                setCurrAdventure(i);
                lastI = i;
              }
            }
          },
          "--rect-width": '0%',
          translateX: '0', // '500px',
          duration: 2
        })
      }) 
    })
    return () => {
      ctx.revert();
    }
  }, [])

  return (
    <div className='relative 
    w-screen h-[100dvh] 
    lg:pt-[6.5rem]
    bg-[#ffffff]'
    ref={pageRef}
    >
      <div  ref={adventuresRef}
        className='landing-page-adventures flex flex-col gap-4 
        items-center lg:max-2xl:items-start 2xl:items-center
        relative
        w-screen h-[100dvh]
        bg-white
        overflow-scroll'
        onWheel={(e) => {
          if (!currAdventure && e.deltaY < 0) {
            dispatch({
              type: TOGGLE_SHOW_ADVENTURES,
              payload: false
            });
            dispatch({
              type: SET_PLACES_SCROLL_POS,
              payload: 'end'
            })
          }
        }}
      >
        {
          ADVENTURES.map((adv, i) => {
            const {name, image} = adv;
            /**
             * scroller start marker should be at the bottom between md and xl lg:w-[300px] lg:h-[400px]
             */
            return (
              <div
                className='rectangle
                flex-shrink-0
                w-[250px] h-[350px]
                sm:w-[400px] sm:h-[500px]
                lg:w-[75dvh] lg:h-[100dvh]
                2xl:w-[500px] 2xl:h-[600px]
                2xl:mr-[500px]
                '
                ref={e => imgRefsArr.current[i] = e}
              >
                <CldImage 
                  src={image}
                  alt={name}
                  fill
                  quality={100}
                  className='max-lg:rounded-lg 2xl:rounded-lg '
                />
              </div>
            )
          })
        }
        <div 
          className='fixed right-0 max-lg:top-[60%] top-[45%] 
          w-full lg:max-2xl:w-[600px] 2xl:w-[800px]
          max-lg:p-[1rem] lg:pr-[160px] 2xl:pr-[240px] 
          mt-12
          text-dark_slate_gray 
          pointer-events-none
        '>
          {
            ADVENTURES.map((adventure, i) => {
              if (i === currAdventure) {
                return (
                  <>
                    <div
                      className='adventure-name-text
                      w-full 
                      pb-2'
                    >
                      <Typography isHeader={false} size='text-xs sm:text-base'>
                        {adventure.name}
                      </Typography>
                    </div>
                    <div
                      className='adventure-text-divider
                      w-full h-[1px] 
                      bg-dark_slate_gray'
                    />
                    <div
                      className='adventure-description-text
                      pt-4'
                    >
                      <Typography isHeader={false} size='text-xs sm:text-base'>
                        {adventure.description}
                      </Typography>
                    </div>
                  </>
                )
              }
            })
          }
        </div>
      </div>
    </div>
  )
}
