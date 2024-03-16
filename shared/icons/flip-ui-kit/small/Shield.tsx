const Shield = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3.16669L3.16667 5.33335C3.16667 5.33335 2.66667 12.8334 8 12.8334C13.3333 12.8334 12.8333 5.33335 12.8333 5.33335L8 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Shield;
