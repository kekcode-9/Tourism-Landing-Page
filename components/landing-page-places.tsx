import React, { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Typography from './common-components/typography';
import constants from '@/utilities/constants';

const { PLACES } = constants;

type placesTextType = {
  name: ((typeof PLACES)[number])['name'],
  description: ((typeof PLACES)[number])['description']
}

type placesImageType = ((typeof PLACES)[number])['image'];

/**
 * placesText type {name, description}[]
 */
const placesText: placesTextType[] = []; 
/**
 * placesImages type string[]
 */
const placesImages: placesImageType[] = [];

PLACES.map((place, i) => {
  const {name, description, image} = place;
  placesText.push({name, description});
  placesImages.push(image);
})

export default function Places() {
  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesRefArr = useRef<(HTMLDivElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const textRefArr = useRef<(HTMLDivElement | null)[]>([]);

  const [currPlaceIndex, setCurrPlaceIndex] = useState<number>(0);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | ''>('');

  let debounceTimer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    /**
     * set device type based on aspect ratio
     */
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDeviceType(width > height ? 'desktop' : 'mobile');

    /**
     * show the 0th place after a remount
     */
    setCurrPlaceIndex(0);
    imgWrapperRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    textContainerRef.current?.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    gsap.to(textRefArr.current[0], {
      opacity: 1,
      translateY: 0,
      delay: 0.3,
      duration: 0.5
    })

    /**
     * intersection observer for detecting a paragraph's entry into view
     * and adding animation to the transition
     */
    const observerOptions = {
      root: textContainerRef.current,
      rootMargin: '0px',
      threshold: 0.5, // Adjust threshold as needed
    };

    const observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry: IntersectionObserverEntry) => {
        const index: number = Number(entry.target.getAttribute('data-index'));
        if (entry.isIntersecting) {
          console.log(`index ${index} just scrolled into view`);
          gsap.to(textRefArr.current[index], {
            opacity: 1,
            translateY: 0,
            delay: 0.3,
            duration: 0.5
          });
        } else {
          console.log(`index: ${index} is out of view`);
        }
      })
    });

    textRefArr.current?.forEach((textRef: HTMLDivElement | null) => {
      textRef && observer.observe(textRef);
    })
    
  }, [imgWrapperRef.current, textContainerRef.current, textRefArr.current])

  useEffect(() => {
    /**
     * scroll on keydown
     */
    let isArrowPressed = false;
    const keyDownHandler = (e: KeyboardEvent) => {
      isArrowPressed = true;
      // console.log(`keydown detected on document with code: ${e.code} | repeat: ${e.repeat}`);
      if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        handleArrowPress(e.code);
      }
    }
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    }
  }, [currPlaceIndex])

  const scroller = (newPlaceIndex: number, scrollUp: boolean, isKeyPress: boolean) => {
    // scroll text
    const nextTextPos = textRefArr.current[newPlaceIndex]?.offsetTop || 0;
    const nextTextHeight = textRefArr.current[newPlaceIndex]?.clientHeight || 0;

    const textContainerHeight = textContainerRef.current?.clientHeight || 0;

    let nextTextTop = nextTextPos - (textContainerHeight / 2) + (nextTextHeight / 2); // nextTextBottom + textContainerHeight;
    if (isKeyPress) {
      nextTextTop = scrollUp ? nextTextTop : nextTextTop - 50;
    }

    textContainerRef.current?.scrollTo({
      top: nextTextTop, // : nextTextPos - textContainerRef.current?.offsetTop ,
      behavior: 'smooth'
    });

    gsap.to(textRefArr.current[currPlaceIndex], {
      opacity: 0,
      translateY: !scrollUp ? '-144px' : '144px',
      duration: 0.5
    });

    // scroll image
    const nextImgPos = imagesRefArr.current[newPlaceIndex]?.offsetTop || 0;
    const nextImgHeight = imagesRefArr.current[newPlaceIndex]?.offsetHeight || 0;
    const nextImgBottom = nextImgPos + nextImgHeight;

    const imgWrapperHeight = imgWrapperRef.current?.clientHeight || 0;

    const nextImgTop = nextImgBottom - imgWrapperHeight;

    imgWrapperRef.current?.scrollTo({
      top: newPlaceIndex ? nextImgTop : 0, // : nextImgPos - imgWrapperRef.current?.offsetTop ,
      behavior: 'smooth'
    });
  }

  const handleArrowPress = useCallback((code: string) => {
    const scrollUp = code === 'ArrowUp';
    console.log(`currPlaceIndex: ${currPlaceIndex}`);
    const newPlaceIndex = !scrollUp ? (currPlaceIndex + 1) : (currPlaceIndex - 1);
    if (newPlaceIndex > PLACES.length - 1 || newPlaceIndex < 0) {
      console.log(`returning with newPlaceIndex: ${newPlaceIndex} and Places length: ${PLACES.length}`);
      return;
    }
    scroller(newPlaceIndex, scrollUp, true);
    setCurrPlaceIndex(newPlaceIndex);
  }, [currPlaceIndex])

  const handleWheelEvent = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    if (debounceTimer) {
      console.log(`debounced`);
      clearTimeout(debounceTimer);
    }

    const scrollUp = e.deltaY < 0;

    if (e.deltaY > 0 || e.deltaY < 0) {
      /**
       * deltaY > 0 means a scroll down (more content is revealed from bottom)
       * deltaY < 0 means a scroll up (content is revealed from the top)
       * The scroll value of +-4 is used to get the extent of the scroll
       */
      debounceTimer = setTimeout(() => {
        const newPlaceIndex = (e.deltaY > 4) ? (currPlaceIndex + 1) : (currPlaceIndex - 1);
        if (newPlaceIndex > PLACES.length - 1 || newPlaceIndex < 0) {
          console.log(`returning with newPlaceIndex: ${newPlaceIndex} and Places length: ${PLACES.length}`);
          return;
        }
        scroller(newPlaceIndex, scrollUp, false);
        setCurrPlaceIndex(newPlaceIndex);
      }, 200)
    }
  }, [currPlaceIndex, imagesRefArr, textRefArr, imgWrapperRef, textRefArr])

  /**
   * At 100% zoom level:
   * window.devicePixelRatio :
   * for desktop : 1
   * for tablets : 2
   * for mobiles : 3
   */

  return (
    <div
      className='content-div
      relative
      flex flex-col items-center justify-start
      w-screen h-screen 
      pt-20 sm:pt-[7.5625rem]%PLACES.length
      overflow-hidden
      bg-white text-black' onWheel={handleWheelEvent}
    >
      {
        /**
         * in desktop we want to make the text take up the entire screen when devicePixelRation >= 1.5
         * in mobile we do not want to make changes based on device pixel ratio
         */
      }
      <div ref={textContainerRef}
        className={`texts-container
        relative ${window.devicePixelRatio < 1.5 ? 'z-20' : 'z-0 sm:z-20'}
        flex flex-col items-center justify-start 
        w-screen  
        h-[51vh]
        ${ 
          deviceType === 'desktop' ? 
          (window.devicePixelRatio < 1.3 ? 'sm:h-[30vh]' : 'sm:h-screen') : 
          'sm:h-[30vh]'
        }
        
        overflow-scroll text-center 
        text-dark_slate_gray
        bg-white shadow-[0px_72px_77px_51px_rgba(255,255,255,1)] 
        pointer-events-none`}
      >
        {
          placesText.map((texts, i) => {
            const {name, description} = texts;
            
            return (
              <div key={i} ref={(ele) => textRefArr.current[i] = ele}
                className={`text-wrapper
                flex flex-col items-center gap-6
                w-screen sm:w-[70vw] xl:w-[50vw]
                max-sm:px-4
                my-20 opacity-0 translate-y-36`} data-index={i}
              >
                <Typography isHeader size='text-[2rem] sm:text-2xl'>
                  {name}
                </Typography>
                <Typography size='text-base sm:text-base'>
                  {description}
                </Typography>
              </div>
            )
          })
        }
      </div>
      <div ref={imgWrapperRef}
        className='images-container
        absolute bottom-0 left-0
        flex flex-col
        w-screen 
        h-[28vh] sm:h-[80vh]
        overflow-scroll 
        pointer-events-none'
      >
        {
          placesImages.map((image, i) => {
            return (
              <div ref={(ele) => imagesRefArr.current[i] = ele}
                className='mask-outer
                relative
                w-full h-full' data-index={i} key={i}
              >
                <div
                  className='mask-inner
                  relative
                  h-[28vh] sm:h-[80vh]'
                >
                  <img
                    src={image}
                    className='place-image 
                    w-full h-full object-cover'
                  />
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
