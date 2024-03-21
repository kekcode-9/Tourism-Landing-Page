"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { CldImage } from "next-cloudinary";
import constants from "@/utilities/constants";
import NameSVG from "./svg-components/name-svg";
import { CloudLeft, CloudRight } from "./svg-components/clouds-svg";

const {
    LAND_OF_CLOUDS,
    GLIMPSE,
} = constants;

export default function EntryLandingPage() {
  const imageRef = useRef<HTMLImageElement>(null);
  const lakeImageRef = useRef<HTMLImageElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const tl = gsap.timeline();
      tl.to(imageRef.current, {
        opacity: 1,
      }).to(imageRef.current, {
        scale: 1,
        translateY: 0,
        transformOrigin: "center",
        filter: "blur(0px)",
        duration: 3,
        ease: "power1.inOut",
      }).set(lakeImageRef.current, {
        display: 'block'
      }).to(imageRef.current, {
        delay: 0.5,
        opacity: 0,
        duration: 0.5
      }).to(overlayRef.current, {
        opacity: 0,
        duration: 0.3
      }, "<+=0.01").set(imageRef.current, {
        display: 'none'
      }).to(lakeImageRef.current, {
        opacity: 1,
        duration: 1
      }, "<+=0.1")
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
      <CloudRight />
      <NameSVG />
      <CloudLeft />
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
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/references/tourism/n46bbpksfofqucmkmqwp"
        alt="green mountains of meghalaya"
        fill
        className="object-cover hidden 
        will-change-auto opacity-0 scale-[1.18] -translate-y-[50px] origin-center"
        loading="lazy"
        quality={100}
      />
      <p>
        {
            LAND_OF_CLOUDS
        }
      </p>
      <CldImage
        ref={imageRef}
        src="https://res.cloudinary.com/dxvx3y6ch/image/upload/f_auto,q_auto/v1/references/tourism/vmlknxcqkc6tjbazxtr5"
        alt="green mountains of meghalaya"
        fill
        className="object-cover 
        will-change-auto opacity-0 scale-[1.18] -translate-y-[50px] blur-[10px] origin-center"
        loading="lazy"
        quality={100}
      />
    </div>
  );
}
