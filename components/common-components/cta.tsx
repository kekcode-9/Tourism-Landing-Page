import React, { useEffect, useRef, useState } from "react";
import OutsideClickHandler from 'react-outside-click-handler';
import Typography from "./typography";

type ctaPropsTypes = {
  label: string;
  smallButton?: boolean;
  onClick?: () => void
};

export default function CTA({ label, smallButton, onClick }: ctaPropsTypes) {

  return (
    <>
      <div
        className={`relative z-30
        flex items-center justify-center
        w-fit h-fit
        md:w-[9rem] md:h-[3rem]
        max-md:px-4 max-md:py-2
        ${
          smallButton
            ? "lg:w-[8rem] lg:h-[2.5rem]"
            : "lg:w-[10rem] lg:h-[3rem] "
        }
        bg-black 
        border border-white
        rounded-full
        text-white
        cursor-pointer`}
        onClick={(e) => {
          onClick && onClick();
        }}
      >
        <Typography
          size={smallButton ? "text-sm lg:text-base" : "text-base lg:text-lg"}
        >
          {label}
        </Typography>
      </div>
    </>
  );
}
