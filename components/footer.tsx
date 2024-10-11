import React from "react";
import { useInView } from "react-intersection-observer";
import constants from "@/utilities/constants";
import Typography from "./common-components/typography";
import CloudAnimation from "./cloud-animation-lottie";

const { FOOTER } = constants;
const { CONTACT_US, NAME, ADDRESS, EMAIL } = FOOTER;

export default function Footer({
  onInView,
  onOut,
}: {
  onInView: () => void;
  onOut: () => void;
}) {
  const { inView, ref } = useInView({
    threshold: 0.6,
    onChange(inView, entry) {
      if (inView) {
        onInView();
      } else {
        onOut();
      }
    },
  });

  return (
    <div
      className="footer-wrapper 
      flex flex-col items-center 
      w-full"
    >
      <div
        className="lottie-wrapper-div 
        w-[600px] h-[300px]
        bg-white"
      >
        <CloudAnimation />
      </div>
      <div
        ref={ref}
        className="footer
        relative z-20
        flex flex-col items-center gap-4
        w-full
        max-sm:mt-8
        py-16 px-16
        bg-columbia_blue
        text-dark_slate_gray"
      >
        <div className="text-[2rem] sm:text-2xl font-bold">{CONTACT_US}</div>
        <div
          className="contact-info-wrapper
          flex flex-col items-center gap-2"
        >
          <Typography isHeader={false}>
            <b>{NAME}</b>
          </Typography>
          <Typography isHeader={false}>{ADDRESS}</Typography>
          <Typography isHeader={false} align="center">
            {EMAIL}
          </Typography>
        </div>
      </div>
    </div>
  );
}
