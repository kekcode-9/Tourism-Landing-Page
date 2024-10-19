"use client";
import React, { useEffect, useRef, useContext, useState } from "react";
import gsap from "gsap";
import { motion } from "framer-motion";
import { CldImage } from "next-cloudinary";
import constants from "@/utilities/constants";
import NameSVG from "./svg-components/name-svg";
import Typography from "./common-components/typography";
import CTA from "./common-components/cta";
import DownArrow from "./svg-components/down-arrow-svg";
import { ACTIONS } from "@/store/actions";
import { TourismContext } from "@/store/tourismStore";
import OutsideClickHandler from "react-outside-click-handler";

const { TOGGLE_SHOW_ENTRY } = ACTIONS;

const { LAND_OF_CLOUDS, GLIMPSE, PLAN_TRIP } = constants;

gsap.config({
  force3D: true,
});

export default function EntryLandingPage({
  showPage
}: {
  showPage: boolean
}) {
  const imageRef = useRef<HTMLImageElement>(null);
  const lakeImageRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const { dispatch } = useContext(TourismContext);

  const [showGlimpseText, toggleShowGlimpseText] = useState<boolean>(false);
  const [showPopup, toggleShowPopup] = useState<boolean>(false);

  useEffect(() => {
    if (imageRef.current) {
      const tl = gsap.timeline();
      tl.to(imageRef.current, {
        opacity: 1,
      })
        .to(imageRef.current, {
          scale: 1,
          translateY: 0,
          transformOrigin: "center",
          filter: "blur(0px)",
          duration: 3,
          ease: "power1.inOut",
        })
        .set(lakeImageRef.current, {
          display: "block",
        })
        .to(imageRef.current, {
          delay: 0.5,
          opacity: 0,
          duration: 0.5,
        })
        .set(imageRef.current, {
          display: "none",
        })
        .to(
          lakeImageRef.current,
          {
            opacity: 1,
            duration: 1,
            onComplete: () => toggleShowGlimpseText(true),
          },
          "<+=0.1"
        )
        .to(taglineRef.current, {
          delay: 0.5,
          opacity: 1,
          duration: 1,
        });
    }

    const handleWheelEvent = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        // scrolling down
        dispatch({
          type: TOGGLE_SHOW_ENTRY,
          payload: false
        })
      }
    }

    const handleKeyDownEvent = (e: KeyboardEvent) => {
      if (e.code === "ArrowDown") {
        dispatch({
          type: TOGGLE_SHOW_ENTRY,
          payload: false
        })
      }
    }

    window.addEventListener('wheel', handleWheelEvent);
    window.addEventListener('keydown', handleKeyDownEvent);

    return () => {
      window.removeEventListener('wheel', handleWheelEvent);
      window.removeEventListener('keydown', handleKeyDownEvent);
    }
  }, [imageRef]);

  return (
    <div
      className={`
        entry-landing-page
        relative 
        ${showPage ? 'flex' : 'hidden'}
        flex items-center justify-center
        w-full h-[100dvh]  
      `}
    >
      {showPopup && (
        <OutsideClickHandler
          onOutsideClick={() => {
            console.log('you clicked outside')
            toggleShowPopup(false);
          }}
        >
          <div
            className="absolute z-[999] top-[calc(50vh-75px)] left-[calc(50vw-200px)]
            flex items-center justify-center
            w-[400px] h-[150px]
            p-4 rounded-md
            bg-columbia_blue text-dark_slate_gray"
          >
            <Typography isHeader={false}>
              No really, I can't plan anything for you. This is a dummy site,
              dummy.
            </Typography>
          </div>
        </OutsideClickHandler>
      )}
      <NameSVG />
      <CldImage
        ref={lakeImageRef}
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/tourism/pn6ehncwz5yecfsukysh"
        blurDataURL="image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAALklEQVR4nGOYcPrW1At3Lnz//+j/fwYmxwAGVTMQEpBjUPOP1E/MdylpCC1tAAB6QQ/jGmBOuAAAAABJRU5ErkJggg=="
        placeholder="blur"
        alt="Umiam lake meghalaya"
        fill
        className="object-cover hidden 
        opacity-0"
        loading="lazy"
        quality={100}
      />
      <div
        ref={taglineRef}
        className="land-of-clouds 
        absolute 
        top-0 
        -bottom-[14.8125rem] sm:-bottom-[19.875rem] 
        left-0 right-0 
        m-auto
        flex flex-col items-center gap-10
        w-fit h-fit
        font-sans
        opacity-0"
      >
        <Typography>{LAND_OF_CLOUDS}</Typography>
        <CTA label={PLAN_TRIP} onClick={() => toggleShowPopup(!showPopup)} />
      </div>
      {showGlimpseText && (
        <div
          className="down-arrow-container
        absolute bottom-[1rem] left-0 right-0 m-auto
        flex flex-col items-center gap-2
        cursor-pointer"
        onClick={() => {
          dispatch({
            type: TOGGLE_SHOW_ENTRY,
            payload: false
          })
        }}
        >
          <Typography>
            <u>{GLIMPSE}</u>
          </Typography>
          <div
            className="w-[2rem] h-[2rem]
          lg:w-[3rem] lg:h-[3rem]"
          >
            <DownArrow />
          </div>
        </div>
      )}
      <CldImage
        ref={imageRef}
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/tourism/obc3l6nl82awssncluwg"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAADCAIAAAA7ljmRAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAMElEQVR4nGO4/vzxh7+/P////+TVWwav9Mi0yXXxzXVmLrYM7OK8zIIcDEwMDAwMAMlZEBeHHltjAAAAAElFTkSuQmCC"
        placeholder="blur"
        alt="green mountains of meghalaya"
        fill
        className="absolute top-0 left-0 object-cover 
        will-change-auto opacity-0 scale-[1.18] blur-[6px] origin-center"
        loading="lazy"
        quality={100}
      />
    </div>
  );
}
