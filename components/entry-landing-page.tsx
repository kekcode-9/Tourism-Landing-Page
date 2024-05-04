"use client";
import React, { useEffect, useRef, useContext } from "react";
import gsap from "gsap";
import { CldImage } from "next-cloudinary";
import constants from "@/utilities/constants";
import NameSVG from "./svg-components/name-svg";
import Typography from "./common-components/typography";
import CTA from "./common-components/cta";
import DownArrow from "./svg-components/down-arrow-svg";
import { ACTIONS } from "@/store/actions";
import { TourismContext } from "@/store/tourismStore";

const { TOGGLE_NAV } = ACTIONS;

const { LAND_OF_CLOUDS, GLIMPSE, PLAN_TRAVEL } = constants;

gsap.config({
  force3D: true
})

export default function EntryLandingPage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const lakeImageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const taglineRef = useRef<HTMLDivElement>(null);

  const {dispatch} = useContext(TourismContext);

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
        .to(
          overlayRef.current,
          {
            opacity: 0,
            duration: 0.3,
          },
          "<+=0.01"
        )
        .set(imageRef.current, {
          display: "none",
        })
        .to(
          lakeImageRef.current,
          {
            opacity: 1,
            duration: 1,
          },
          "<+=0.1"
        )
        .set(overlayRef.current, {
          display: "none",
        })
        .to(taglineRef.current, {
            delay: 0.5,
            opacity: 1,
            duration: 1
        });
    }
    if (overlayRef.current) {
      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power1.out",
      });
    }
  }, [imageRef, overlayRef]);

  return (
    <div
      className="relative 
      flex items-center justify-center
      w-full h-full"
    >
      <NameSVG />
      <div
        ref={overlayRef}
        className="overlay-div
        absolute top-0 left-0 z-10
        w-full h-full
        bg-[#012B41] bg-opacity-[0.25]
        opacity-0"
      />
      <CldImage
        ref={lakeImageRef}
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/references/tourism/wo4fauoa1ed4otzuaadw"
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
        <CTA label={PLAN_TRAVEL} />
      </div>
      <div
        className="down-arrow-container
        absolute bottom-[1rem] left-0 right-0 m-auto
        flex flex-col items-center gap-2"
      >
        <Typography>
          <u>{GLIMPSE}</u>
        </Typography>
        <div
          className="w-[2rem] h-[2rem]
          lg:w-[3rem] lg:h-[3rem]"
        >
          <DownArrow/>
        </div>
      </div>
      <CldImage
        ref={imageRef}
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/references/tourism/vmlknxcqkc6tjbazxtr5"
        alt="green mountains of meghalaya"
        fill
        className="absolute top-0 left-0 object-cover 
        will-change-auto opacity-0 scale-[1.18] -translate-y-[50px] blur-[6px] origin-center"
        loading="lazy"
        quality={100}
      />
    </div>
  );
}
