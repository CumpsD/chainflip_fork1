const ShieldWarning = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
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
      d="M8.33335 10C8.33335 10.1841 8.18409 10.3334 8.00002 10.3334C7.81595 10.3334 7.66669 10.1841 7.66669 10C7.66669 9.81595 7.81595 9.66669 8.00002 9.66669C8.18409 9.66669 8.33335 9.81595 8.33335 10Z"
      stroke="currentColor"
      strokeWidth="0.666667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00002 6V7.33333"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ShieldWarning;
