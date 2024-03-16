const Piggybank = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16669 9.33334V7.33334C3.16669 6.96514 3.46517 6.66664 3.83335 6.66664H4.50002C4.50002 6.66664 4.50002 4.49998 6.66669 4.49998V3.16664C6.66669 3.16664 8.00002 2.99998 8.00002 4.49998H10.1667C11.6394 4.49998 12.8334 5.69388 12.8334 7.16667V8.83334C12.8334 10.3061 11.6394 11.5 10.1667 11.5H6.00002C4.50002 11.5 4.50002 10 4.50002 10H3.83335C3.46517 10 3.16669 9.70147 3.16669 9.33334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.00001 7.33333C7.00001 7.5174 6.85074 7.66667 6.66668 7.66667C6.48258 7.66667 6.33334 7.5174 6.33334 7.33333C6.33334 7.14927 6.48258 7 6.66668 7C6.85074 7 7.00001 7.14927 7.00001 7.33333Z"
      stroke="currentColor"
      strokeWidth="0.666667"
    />
    <path
      d="M5.83334 11.6667V12.8334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1667 11.6667V12.8334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Piggybank;
