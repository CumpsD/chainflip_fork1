const Hourglass = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.83334 3.16669H12.1667M4.5 3.16669H11.5V4.00002C11.5 5.93301 9.933 7.50002 8 7.50002C6.06701 7.50002 4.5 5.93302 4.5 4.00002V3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 6.66667H10Z"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.83334 12.8334H12.1667M4.5 12.8334H11.5V11.6667C11.5 9.73369 9.933 8.16669 8 8.16669C6.06701 8.16669 4.5 9.73369 4.5 11.6667V12.8334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Hourglass;
