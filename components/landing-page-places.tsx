import React, { 
  useCallback, 
  useEffect, 
  useRef, 
  useState, 
  useContext, 
  useLayoutEffect 
} from 'react';
import { CldImage } from 'next-cloudinary';
import gsap from 'gsap';
import { TourismContext } from '@/store/tourismStore';
import Typography from './common-components/typography';
import constants from '@/utilities/constants';
import { ACTIONS } from '@/store/actions';

const { PLACES } = constants;

const { SET_PLACES_SCROLL_POS, TOGGLE_SHOW_ADVENTURES } = ACTIONS;

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
  const { dispatch, state } = useContext(TourismContext);
  const { placesScrollPos } = state;

  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesRefArr = useRef<(HTMLDivElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement | null>(null);
  const textRefArr = useRef<(HTMLDivElement | null)[]>([]);

  const [currPlaceIndex, setCurrPlaceIndex] = useState<number>(0);
  const [deviceType, setDeviceType] = useState<'desktop' | 'mobile' | ''>('');
  const [scrollUp, isScrollUp] = useState<boolean | null>(null);
  const [lastTouchY, setLastTouchY] = useState<number>(0);
  const [testMessage, setTestMessage] = useState<string>('');

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
    const index = placesScrollPos === 'end' ? placesText.length - 1 : 0;
    setCurrPlaceIndex(index); // when currPlaceIndex is updated, the useEffect depending on it will show the text animation
    if (index && imgWrapperRef.current) {
      imgWrapperRef.current.scrollTop = imgWrapperRef.current?.scrollHeight;
    } else {
      imgWrapperRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }

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

    // textRefArr.current?.forEach((textRef: HTMLDivElement | null) => {
    //   textRef && observer.observe(textRef);
    // })
    
  }, [
    imgWrapperRef.current, 
    textContainerRef.current, 
    textRefArr.current
  ])

  useEffect(() => {
    /**
     * scroll on keydown
     */
    const keyDownHandler = (e: KeyboardEvent) => {
      // console.log(`keydown detected on document with code: ${e.code} | repeat: ${e.repeat}`);
      if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        handleArrowPress(e.code);
      }
    }
    document.addEventListener('keydown', keyDownHandler);
    window.addEventListener('wheel', (e) => {
      console.log('wheeling with deltaY: ', e.deltaY);
      handleWheelEvent(e);
    });
    // window.addEventListener('touchmove', (e) => {
    //   setLastTouchY(e.touches[0].clientY)
    // })

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('wheel', handleWheelEvent);
    }
  }, [currPlaceIndex])

  useLayoutEffect(() => {
    if (textRefArr.current[currPlaceIndex] && scrollUp !== null) {
      const tl = gsap.timeline(); 
      /**
       * during the set animation, we translate the div's translateY 9rem up or down based on whether the
       * scroll direction is up or down respectively.
       * That way, when the to animation sets the translateY back to 0 it will look like the div is
       * sliding in from top ( for a scroll up ) or sliding up from below ( for a scroll down )
       */
      tl.set(textRefArr.current[currPlaceIndex], {
        opacity: 0,
        translateY: scrollUp ? '-9rem' : '9rem'
      }).to(textRefArr.current[currPlaceIndex], {
        opacity: 1,
        translateY: 0,
        duration: 0.5
      })
    }
    /**
     * set placesScrollPos
     */
    console.log(`placesScrollPos: dispatching with: ${currPlaceIndex ?(currPlaceIndex === placesText.length - 1 ? 'end' : 'middle') : 'start'}`)
    
  }, [currPlaceIndex, scrollUp])

  const scroller = (newPlaceIndex: number, scrollUp: boolean) => {
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

    // scroll text
    let lastIndex = scrollUp ? newPlaceIndex + 1 : newPlaceIndex - 1;

    const tl = gsap.timeline();
    tl.to(textRefArr.current[lastIndex], {
      translateY: scrollUp ? '9rem' : '-9rem',
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setCurrPlaceIndex(newPlaceIndex);
        isScrollUp(scrollUp);
        dispatch({
          type: SET_PLACES_SCROLL_POS,
          payload: newPlaceIndex ? (
            newPlaceIndex === placesText.length - 1 ?
              'end' :
              'middle'
          ) : 'start'
        })
      }
    });
  }

  const handleArrowPress = useCallback((code: string) => {
    const scrollUp = code === 'ArrowUp';
    console.log(`handleArrowPress | currPlaceIndex: ${currPlaceIndex}`);
    const newPlaceIndex = !scrollUp ? (currPlaceIndex + 1) : (currPlaceIndex - 1);
    if (newPlaceIndex > PLACES.length - 1 || newPlaceIndex < 0) {
      newPlaceIndex > PLACES.length - 1 &&
      dispatch({
        type: TOGGLE_SHOW_ADVENTURES,
        payload: true
      });
      return;
    }
    scroller(newPlaceIndex, scrollUp);
  }, [currPlaceIndex])

  const handleWheelEvent = useCallback((e: WheelEvent) => {
    e.preventDefault();
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
          newPlaceIndex > PLACES.length - 1 &&
          dispatch({
            type: TOGGLE_SHOW_ADVENTURES,
            payload: true
          });
            return;
          }
        scroller(newPlaceIndex, scrollUp);
      }, 200)
    }
  }, [currPlaceIndex, imagesRefArr, textRefArr, imgWrapperRef])

  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    /**
     * if lastTouchY > currentTouchY --> reveal from bottom --> scroll down
     * if e.touches[0].clientY increases in value then content is to be revealed from above - scroll up
     */
    const currentTouchY = e.changedTouches[0].clientY;
    setTestMessage('currentTouchY: ' + currentTouchY);
    let msg = '';

    let newPlaceIndex;
    let scrollUp = false;
    if (currentTouchY > lastTouchY) {
      newPlaceIndex = currPlaceIndex + 1;
      scrollUp = false;
    } else if (currentTouchY < lastTouchY) {
      newPlaceIndex = currPlaceIndex - 1;
      scrollUp = true;
    }
    if (newPlaceIndex) {
      setTestMessage(msg + ' | calling scroller with index ' + newPlaceIndex);
      if (newPlaceIndex > PLACES.length - 1 || newPlaceIndex < 0) {
        newPlaceIndex > PLACES.length - 1 &&
        dispatch({
          type: TOGGLE_SHOW_ADVENTURES,
          payload: true
        });
          return;
      }
      scroller(newPlaceIndex, scrollUp);
    }
  }, [lastTouchY, currPlaceIndex])

  /**
   * At 100% zoom level:
   * window.devicePixelRatio :
   * for desktop : 1
   * for tablets : 2
   * for mobiles : 3
   */

  return (
    <div
      className='landing-page-places-content-div
      relative
      flex flex-col items-center justify-start
      w-screen h-screen 
      pt-20 sm:pt-[7.5625rem]%PLACES.length
      overflow-hidden
      bg-white text-black' 
      onTouchStart={(e) => setLastTouchY(e.touches[0].clientY)}
      onTouchEnd={handleTouchMove}
    >
      {
        /**
         * in desktop we want to make the text take up the entire screen when devicePixelRation >= 1.5
         * in mobile we do not want to make changes based on device pixel ratio
         * ${window.devicePixelRatio < 1.5 ? 'z-20' : 'z-0 sm:z-20'}
         */
      }
      <div ref={textContainerRef}
        className={`texts-container
        relative z-20
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
            // opacity-0 translate-y-36
            if (i !== currPlaceIndex) {
              return <></>;
            }
            return (
              <div key={i} ref={(ele) => textRefArr.current[i] = ele}
                className={`text-wrapper
                flex flex-col items-center gap-6
                w-screen sm:w-[70vw] xl:w-[50vw]
                max-sm:px-4
                mt-[2rem] sm:my-20 `} data-index={i}
              >
                <Typography isHeader size='text-[2rem] sm:text-2xl'>
                  {name} 
                </Typography>
                <Typography size='text-xs sm:text-base'>
                  {/* {description} */}
                  {currPlaceIndex} - {lastTouchY} - {testMessage}
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
                  w-full
                  h-[28vh] sm:h-[80vh]'
                >
                  <CldImage
                    src={image}
                    alt={''}
                    fill
                    className='place-image 
                    object-cover'
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
