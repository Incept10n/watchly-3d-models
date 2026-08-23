import type { IconComponent } from "@/shared/types";

export const ArrowIcon: IconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="9"
      viewBox="0 0 17 9"
      fill="none"
      {...props}
    >
      <path
        d="M16 8L8.5 1L1 8"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
