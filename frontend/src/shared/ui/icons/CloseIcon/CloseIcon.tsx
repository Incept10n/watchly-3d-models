import type { IconComponent } from "@/shared/types";

export const CloseIcon: IconComponent = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
    >
      <g clipPath="url(#clip0_103_302)">
        <path
          d="M18 35.25C27.5269 35.25 35.25 27.5269 35.25 18C35.25 8.47309 27.5269 0.75 18 0.75C8.47309 0.75 0.75 8.47309 0.75 18C0.75 27.5269 8.47309 35.25 18 35.25Z"
          stroke="#9B9B9B"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M11.25 11.25L24.75 24.75"
          stroke="#9B9B9B"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
        <path
          d="M11.25 24.75L24.75 11.25"
          stroke="#9B9B9B"
          strokeWidth="2"
          strokeMiterlimit="10"
        />
      </g>
      <defs>
        <clipPath id="clip0_103_302">
          <rect width="36" height="36" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};