const PinTack = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.83334 5.16669L5.16668 3.16669H10.8333L10.1667 5.16669V6.66669C12.1667 7.33335 12.1667 9.50002 12.1667 9.50002H3.83334C3.83334 9.50002 3.83334 7.33335 5.83334 6.66669V5.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00002 9.66669V12.8334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PinTack;
