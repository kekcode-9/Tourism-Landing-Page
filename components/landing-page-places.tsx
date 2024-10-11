import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useContext,
} from "react";
import { useInView } from "react-intersection-observer";
import { CldImage } from "next-cloudinary";
import { AnimatePresence, motion } from "framer-motion";
import { TourismContext } from "@/store/tourismStore";
import Typography from "./common-components/typography";
import constants from "@/utilities/constants";
import { ACTIONS } from "@/store/actions";
import Arrows from "./common-components/arrows";

const { PLACES } = constants;

const { SET_PLACES_SCROLL_POS, TOGGLE_SHOW_ADVENTURES } = ACTIONS;

type placesTextType = {
  name: (typeof PLACES)[number]["name"];
  description: (typeof PLACES)[number]["description"];
};

type placesImageType = (typeof PLACES)[number]["image"];

/**
 * placesText type {name, description}[]
 */
const placesText: placesTextType[] = [];
/**
 * placesImages type string[]
 */
const placesImages: placesImageType[] = [];

PLACES.map((place, i) => {
  const { name, description, image } = place;
  placesText.push({ name, description });
  placesImages.push(image);
});

export default function Places() {
  const { dispatch, state } = useContext(TourismContext);
  const { placesScrollPos, showAdventures } = state;

  const imgWrapperRef = useRef<HTMLDivElement | null>(null);
  const imagesRefArr = useRef<(HTMLDivElement | null)[]>([]);
  const textContainerRef = useRef<HTMLDivElement | null>(null);

  const [currPlaceIndex, setCurrPlaceIndex] = useState<number>(0);
  const [deviceType, setDeviceType] = useState<"desktop" | "mobile" | "">("");
  const [scrollUp, isScrollUp] = useState<boolean | null>(null);

  const [deltaYArr, updateDeltaYArr] = useState<number[]>([]);
  const [readytoScroll, toggleReadyToScroll] = useState<boolean>(true);

  const {inView: topInView, ref: topRef } = useInView({
    threshold: 1,
    onChange(inView, entry) {
      if (inView) {
        console.log("topInView")
      }
    },
  });
  const {inView: bottomInView, ref: bottomRef } = useInView({
    threshold: 1,
    onChange(inView, entry) {
      if (inView) {
        console.log("bottomInview")
      }
    }
  });

  let debounceTimer: ReturnType<typeof setTimeout>;

  useEffect(() => {
    /**
     * set device type based on aspect ratio
     */
    const width = window.innerWidth;
    const height = window.innerHeight;
    setDeviceType(width > height ? "desktop" : "mobile");

    /**
     * show the right image after a remount
     */
    const index = placesScrollPos === "end" ? placesText.length - 1 : 0;
    setCurrPlaceIndex(index); // when currPlaceIndex is updated, the useEffect depending on it will show the text animation
    if (index && imgWrapperRef.current) {
      imgWrapperRef.current.scrollTop = imgWrapperRef.current?.scrollHeight;
    } else {
      imgWrapperRef.current?.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, [imgWrapperRef.current]);

  const scroller = (newPlaceIndex: number, scrollUp: boolean) => {
    console.log(
      `scroller: newPlaceIndex: ${newPlaceIndex} | scrollUp: ${scrollUp}`
    );
    // scroll image
    const nextImgPos = imagesRefArr.current[newPlaceIndex]?.offsetTop || 0;
    const nextImgHeight =
      imagesRefArr.current[newPlaceIndex]?.offsetHeight || 0;
    const nextImgBottom = nextImgPos + nextImgHeight;

    const imgWrapperHeight = imgWrapperRef.current?.clientHeight || 0;

    const nextImgTop = nextImgBottom - imgWrapperHeight;

    imgWrapperRef.current?.scrollTo({
      top: newPlaceIndex ? nextImgTop : 0,
      behavior: "smooth",
    });

    // exit animation for text from the last displayed place
    isScrollUp(scrollUp);
    setCurrPlaceIndex(newPlaceIndex);
    setTimeout(() => {
      toggleReadyToScroll(true);
    }, 1000);
    const placePosition = newPlaceIndex
      ? newPlaceIndex >= placesText.length - 1
        ? "end"
        : "middle"
      : "start";

    dispatch({
      type: SET_PLACES_SCROLL_POS,
      payload: placePosition,
    });
  };

  const handleArrowPress = useCallback(
    (code: string) => {
      const scrollUp = code === "ArrowUp";
      console.log(`handleArrowPress | currPlaceIndex: ${currPlaceIndex}`);
      let newPlaceIndex = currPlaceIndex;
      if (scrollUp && currPlaceIndex) {
        newPlaceIndex--;
      } else if (!scrollUp && currPlaceIndex < PLACES.length - 1) {
        newPlaceIndex++;
      }
      if (newPlaceIndex !== currPlaceIndex) {
        scroller(newPlaceIndex, scrollUp);
      } else if (newPlaceIndex === PLACES.length - 1) {
        dispatch({
          type: TOGGLE_SHOW_ADVENTURES,
          payload: true,
        });
      }
    },
    [currPlaceIndex]
  );

  const handleWheelEvent = useCallback(
    (e: WheelEvent) => {
      // React.WheelEvent<HTMLDivElement>
      e.preventDefault();
      console.log("test | handleWheelEvent called | deltaYArr: ", deltaYArr);

      if (!deltaYArr.length) {
        console.log("test | new session");
        updateDeltaYArr([e.deltaY]);
      } else {
        let latestScrollArr = [...deltaYArr];
        const firstDeltaY = latestScrollArr[0];
        const lastDeltaY = e.deltaY;
        const sameDir = firstDeltaY * lastDeltaY > 0; // check if both deltaY have the same sign
        console.log(`isSameDir: ${sameDir} | firstDeltaY: ${firstDeltaY} | lastDeltaY: ${lastDeltaY}`);

        /**
         * for trackpad scroll, deltaY will change between consecutive scroll events in the same direction
         * for mouse scroll, deltaY will remain the same between consecutive scroll events in the same direction
         * and will change sign when the direction changes
         */
        if (sameDir && (Math.abs(firstDeltaY - lastDeltaY) >= 30 || firstDeltaY === lastDeltaY)) {
          // if the deltaY are both in same direction and their difference crosses the threshold
          const scrollUp = lastDeltaY < 0;
          let newPlaceIndex = currPlaceIndex;
          console.log(
            `currPlaceIndex: ${currPlaceIndex} | scrollUp: ${scrollUp}`
          );
          if (scrollUp && currPlaceIndex) {
            // if scrolling up true and there is anything to show up there
            newPlaceIndex--;
          } else if (!scrollUp && currPlaceIndex < PLACES.length - 1) {
            // if scrolling down and there is anything to show down there
            newPlaceIndex++;
          }
          if (newPlaceIndex !== currPlaceIndex) {
            toggleReadyToScroll(false);
            scroller(newPlaceIndex, scrollUp);
            console.log(
              `test | update newPlaceIndex to ${newPlaceIndex} while curr is ${currPlaceIndex} | firstDeltaY: ${firstDeltaY} and lastDeltaY: ${lastDeltaY}`
            );
            setCurrPlaceIndex(newPlaceIndex);
          } else if (currPlaceIndex === PLACES.length - 1) {
            dispatch({
              type: TOGGLE_SHOW_ADVENTURES,
              payload: true,
            });
          }

          // reset after a scroll completion
          latestScrollArr = [];
        } else if (!sameDir) {
          console.log("test | not sameDir. resetting");
          // if the first and last deltaY are in opposite directions then reset
          latestScrollArr = [];
        }

        updateDeltaYArr(latestScrollArr);
      }
    },
    [currPlaceIndex, deltaYArr]
  );

  const handleArrowIconClick = useCallback(
    (up: boolean) => {
      let newPlaceIndex = currPlaceIndex;
      if (up && currPlaceIndex) {
        newPlaceIndex--;
      } else if (!up && currPlaceIndex < PLACES.length - 1) {
        newPlaceIndex++;
      }

      if (newPlaceIndex !== currPlaceIndex) {
        scroller(newPlaceIndex, up);
      } else if (currPlaceIndex === PLACES.length - 1) {
        dispatch({
          type: TOGGLE_SHOW_ADVENTURES,
          payload: true,
        });
      }
    },
    [currPlaceIndex]
  );

  // effects
  useEffect(() => {
    /**
     * scroll on keydown
     */
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.code === "ArrowUp" || e.code === "ArrowDown") {
        handleArrowPress(e.code);
      }
    };
    const debouncedWheelEvent = (e: WheelEvent) => {
      if (readytoScroll) {
        handleWheelEvent(e);
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    window.addEventListener("wheel", debouncedWheelEvent);

    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      window.removeEventListener("wheel", debouncedWheelEvent);
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [handleWheelEvent, readytoScroll]);

  if (showAdventures) {
    return;
  }

  return (
    <div
      className="landing-page-places-content-div
      relative
      flex flex-col items-center justify-end lg:justify-start
      w-screen h-[100dvh] 
      bg-white text-black"
    >
      {/* <div ref={topRef}
        className="top-div absolute top-[-4px] z-50
        w-full h-[4px] bg-[#FF0000]"
      /> */}
      <div
        ref={textContainerRef}
        className={`texts-container
        relative z-20
        flex flex-col items-center justify-start 
        w-screen  
        h-[51dvh] lg:h-[40vh]
        lg:pt-20
        ${
          deviceType === "desktop"
            ? window.devicePixelRatio < 1.3
              ? "sm:h-[30dvh]"
              : "sm:h-screen"
            : "sm:h-[30dvh]"
        }
        
        overflow-scroll text-center 
        text-dark_slate_gray
        bg-white
        shadow-[-1px_-41px_102px_25px_rgba(255,255,255,1)] 
        lg:shadow-[0px_72px_77px_51px_rgba(255,255,255,1)] 
        max-lg:mb-[3rem] 
        pointer-events-none`}
      >
        <AnimatePresence>
          {placesText.map((texts, i) => {
            const { name, description } = texts;
            if (i === currPlaceIndex) {
              return (
                <motion.div
                  key={name.replace(" ", "_")}
                  className={`text-wrapper
                    flex flex-col items-start lg:items-center gap-6
                    w-screen sm:w-[70vw] xl:w-[50vw]
                    max-sm:px-4
                    ${window.innerHeight >= 800 ? "sm:my-20" : "sm:my-9"}
                    max-lg:text-left`}
                  data-index={i}
                  initial={{
                    opacity: 0,
                    translateY: scrollUp ? "-9rem" : "9rem",
                  }}
                  animate={{
                    opacity: 1,
                    translateY: 0,
                    transition: {
                      delay: 0.5,
                      duration: 0.3,
                    },
                  }}
                  exit={{
                    // translateY: scrollUp ? '9rem' : '-9rem',
                    opacity: 0,
                    transition: {
                      // delay: 0.5,
                      duration: 0.3,
                    },
                  }}
                >
                  <Typography isHeader size="text-[2rem] sm:text-2xl">
                    {name}
                  </Typography>
                  <Typography size="text-xs sm:text-base">
                    {description}
                  </Typography>
                </motion.div>
              );
            }
          })}
        </AnimatePresence>
      </div>
      <Arrows
        onUpArrowClick={() => handleArrowIconClick(true)}
        onDownArrowClick={() => {
          handleArrowIconClick(false);
        }}
      />
      <div
        ref={imgWrapperRef}
        className="images-container
        absolute max-lg:top-[4.375rem] lg:bottom-0 left-0
        flex flex-col
        w-screen 
        h-[28dvh] sm:h-[80dvh]
        overflow-scroll 
        pointer-events-none"
      >
        {placesImages.map((image, i) => {
          return (
            <div
              ref={(ele) => (imagesRefArr.current[i] = ele)}
              className="mask-outer
                relative
                w-full h-full"
              data-index={i}
              key={i}
            >
              <div
                className="mask-inner
                  relative
                  w-full
                  h-[28dvh] sm:h-[80dvh]"
              >
                <CldImage
                  src={image}
                  alt={""}
                  fill
                  loading="lazy"
                  className="place-image 
                    object-cover"
                />
              </div>
            </div>
          );
        })}
      </div>
      {/* <div ref={bottomRef}
        className="bottom-div absolute bottom-[-4px] z-50
        w-full h-[4px] bg-[#FF0000]"
      /> */}
    </div>
  );
}
