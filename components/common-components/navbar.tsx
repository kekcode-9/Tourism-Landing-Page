import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import constants from "@/utilities/constants";
import Typography from "./typography";
import CTA from "./cta";
import BurgerMenu from "../svg-components/burger-menu";
import OutsideClickHandler from "react-outside-click-handler";

export default function Navbar() {
  const navRef = useRef<HTMLDivElement>(null);

  const [showMenuOnMobile, setShowMenuOnMobile] = useState<boolean>(false);
  const [showPopup, toggleShowPopup] = useState(false);

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

    const handleWindowClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as HTMLElement)) {
        setShowMenuOnMobile(false);
      }
    }

    window.addEventListener('click', handleWindowClick);

    return () => {
      window.removeEventListener('click', handleWindowClick);
    }
  }, [showMenuOnMobile, burgerMenuRef, menuItemsRef])

  return (
    <>
      <div ref={navRef}
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
          border-b-[1px] border-b-white 
          bg-opacity-[0.4] backdrop-blur-[40px]"
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
            <CTA smallButton label={constants.PLAN_TRIP} onClick={() => {
              toggleShowPopup(!showPopup) 
            }} />
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
    </>
  );
}
