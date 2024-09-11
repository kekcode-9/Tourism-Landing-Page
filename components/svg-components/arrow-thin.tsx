import React from "react";

type ArrowThinPropTypes = {
    downwards?: boolean
}

export default function ArrowThin({
    downwards = false
}: ArrowThinPropTypes) {
  return (
    <svg
      width="8"
      height="45"
      viewBox="0 0 8 45"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={downwards ? 'rotate(180)' : 'rotate(0)'}
    >
      <path
        d="M4.35355 0.646447C4.15829 0.451184 3.84171 0.451184 3.64644 0.646447L0.464464 3.82843C0.269202 4.02369 0.269202 4.34027 0.464464 4.53553C0.659726 4.7308 0.976309 4.7308 1.17157 4.53553L4 1.70711L6.82843 4.53553C7.02369 4.7308 7.34027 4.7308 7.53553 4.53553C7.73079 4.34027 7.73079 4.02369 7.53553 3.82843L4.35355 0.646447ZM4.5 45L4.5 1L3.5 1L3.5 45L4.5 45Z"
        fill="black"
      />
    </svg>
  );
}
