const ShieldTick = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.00002 3.16669L3.1667 5.33335C3.1667 5.33335 2.6667 12.8334 8.00002 12.8334C13.3334 12.8334 12.8334 5.33335 12.8334 5.33335L8.00002 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.50002 8.5L7.33335 9.5L9.50002 6.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ShieldTick;
