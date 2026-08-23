import type { IconComponent } from "@/shared/types";

export const UserIcon: IconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      {...props}
    >
      <path
        d="M26.6673 28C26.6673 24.3181 21.8917 21.3333 16.0007 21.3333C10.1096 21.3333 5.33398 24.3181 5.33398 28M16.0007 17.3333C12.3188 17.3333 9.33398 14.3486 9.33398 10.6667C9.33398 6.98477 12.3188 4 16.0007 4C19.6826 4 22.6673 6.98477 22.6673 10.6667C22.6673 14.3486 19.6826 17.3333 16.0007 17.3333Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
