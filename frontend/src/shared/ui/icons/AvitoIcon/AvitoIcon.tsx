import type { IconComponent } from "@/shared/types";

export const AvitoIcon: IconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      {...props}
    >
      <rect
        x="1"
        y="1"
        width="46.0001"
        height="46"
        rx="14"
        fill="black"
        stroke="black"
        strokeWidth="2"
      />
      <ellipse
        cx="16.2636"
        cy="30.5344"
        rx="11.0683"
        ry="11.0423"
        fill="white"
      />
      <ellipse
        cx="32.9219"
        cy="16.3946"
        rx="9.09179"
        ry="9.07042"
        fill="white"
      />
      <ellipse
        cx="18.5226"
        cy="13.8585"
        rx="4.17884"
        ry="4.16901"
        fill="white"
      />
      <ellipse
        cx="35.2942"
        cy="33.296"
        rx="6.72002"
        ry="6.70423"
        fill="white"
      />
    </svg>
  );
};
