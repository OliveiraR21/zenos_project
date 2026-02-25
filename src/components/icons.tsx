import type { SVGProps } from "react";

export function ZenosLogo(props: SVGProps<SVGSVGElement>) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path d="M4 4h16v2.5L10.5 17.5H20v2.5H4v-2.5L13.5 6.5H4V4z" />
      </svg>
    );
  }
  