import type { IconComponent } from "@/shared/types";

export const NotFoundWatchIcon: IconComponent = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="272"
      height="272"
      viewBox="0 0 272 272"
      fill="none"
      {...props}
    >
      <circle cx="136" cy="136" r="132" stroke="#E50000" strokeWidth="8" />
      <g transform="translate(8, 8)">
        <circle cx="128" cy="128" r="126.5" stroke="black" strokeWidth="3" />
      </g>
      <g transform="translate(75.080078125, 79.27490234375)">
        <path
          d="M60.1062 42.0117C66.9432 42.0117 72.6247 47.7625 72.6247 55.0309C72.6247 62.2992 66.9432 68.05 60.1062 68.05C53.2692 68.05 47.5877 62.2992 47.5877 55.0309C47.5877 47.7625 53.2692 42.0117 60.1062 42.0117Z"
          stroke="#171717"
          strokeWidth="5"
        />
        <circle
          cx="59.6055"
          cy="55.0309"
          r="16.5273"
          stroke="#E50000"
          strokeWidth="4"
        />
        <path
          d="M58.1033 77.5641H62.1092L60.7071 177.712H59.7056L58.1033 77.5641Z"
          fill="#E50000"
        />
        <path
          d="M0.000883451 22.0051L2.00384 18.5359L42.2375 39.2282L38.2316 46.1666L0.000883451 22.0051Z"
          fill="#171717"
        />
        <path
          d="M149.367 0.000196968L151 2.82888L81.6347 44.9452L78.3684 39.2879L149.367 0.000196968Z"
          fill="#171717"
        />
      </g>
    </svg>
  );
};
