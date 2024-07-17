import React, { useContext, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import constants from "@/utilities/constants";
import Typography from "./typography";
import CTA from "./cta";
import BurgerMenu from "../svg-components/burger-menu";
import { TourismContext } from "@/store/tourismStore";

export default function Navbar() {
  const { state, dispatch } = useContext(TourismContext);
  const { showEntry } = state;

  const [showMenuOnMobile, setShowMenuOnMobile] = useState<boolean>(false);

  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLAnchorElement[]>([]);

  useEffect(() => {
    if (burgerMenuRef.current) {
      const tl: gsap.core.Timeline = gsap.timeline();

      if (showMenuOnMobile) {
        tl.set(burgerMenuRef.current, {
          display: 'flex'
        })
        .to(burgerMenuRef.current, {
          scaleY: 1,
          transformOrigin: 'top'
        })
        .to(menuItemsRef.current, {
          opacity: 1,
          duration: 0.3,
          stagger: 0.2
        })
      } else {
        tl.set(burgerMenuRef.current, {
          display: 'hidden'
        })
        .to(menuItemsRef.current, {
          opacity: 0,
          duration: 0.3,
          stagger: 0.2
        })
        .to(burgerMenuRef.current, {
          scaleY: 0,
          transformOrigin: 'top'
        })
      }
    }
  }, [showMenuOnMobile, burgerMenuRef, menuItemsRef])

  return (
    <div
      className="navbar-container
      fixed z-[100] top-0 left-0
      flex-col
      w-screen h-auto"
    >
      <div
        className="navbar
        flex items-center justify-between
        w-screen h-fit 
        py-4 px-4
        sm:py-8 sm:px-16
        bg-white 
        border-b-[1px] border-b-white bg-opacity-15"
      >
        <div
          className="max-lg:flex items-center gap-4
          text-black"
        >
          <div className="lg:hidden w-fit h-fit cursor-pointer"
            onClick={() => setShowMenuOnMobile(!showMenuOnMobile)}
          >
            <BurgerMenu />
          </div>
          <Typography isHeader size="text-3xl font-bold">
            Meghalaya
          </Typography>
        </div>
        <div
          className="flex items-center justify-center lg:gap-16 xl:gap-24 
          text-dark_slate_gray"
        >
          <div className="hidden lg:flex items-center justify-center lg:gap-16 xl:gap-24">
            {Object.entries(constants.NAV).map(
              ([key, value]: [string, string], index: number) => {
                return (
                  <Link key={key} href={value.toLowerCase()}>
                    <Typography size="text-lg">{value}</Typography>
                  </Link>
                );
              }
            )}
          </div>
          <CTA smallButton label={constants.PLAN_TRIP} />
        </div>
      </div>
      <div ref={burgerMenuRef}
        className={`hidden flex-col sm:flex-row items-center justify-center gap-16
        py-8
        text-dark_slate_gray
        bg-columbia_blue bg-opacity-40 backdrop-blur-[8px] 
        scale-y-0
        `}
      >
        {Object.entries(constants.NAV).map(
          ([key, value]: [string, string], index: number) => {
            return (
              <Link key={key} href={value.toLowerCase()}
                className="text-center opacity-0"
                ref = {(ele) => {
                  if (ele) {
                    menuItemsRef.current[index] = ele
                  }
                }}
              >
                <Typography size="text-lg">{value}</Typography>
              </Link>
            );
          }
        )}
      </div>
    </div>
  );
}
