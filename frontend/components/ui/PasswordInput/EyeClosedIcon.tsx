import type { JSX } from "react";

const EyeClosedIcon = (): JSX.Element => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ transform: "scaleY(-1)" }}
  >
    <path d="M3 13 Q12 7 21 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <line
      x1=" 6.5"
      y1="    12"
      x2="     5.5"
      y2="  9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="9.5"
      y1="10.2"
      x2="9"
      y2="7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="12"
      y1="9.5"
      x2="12"
      y2="6.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="14.5"
      y1="10.2"
      x2="15"
      y2="7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <line
      x1="17.5"
      y1="12"
      x2="18.5"
      y2="9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export default EyeClosedIcon;
