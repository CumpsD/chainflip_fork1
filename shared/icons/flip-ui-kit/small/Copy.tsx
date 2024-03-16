const Copy = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.33333 10.1667C3.689 10.1667 3.16666 9.64435 3.16666 9.00002V4.50002C3.16666 3.76364 3.76362 3.16669 4.5 3.16669H9C9.64433 3.16669 10.1667 3.68902 10.1667 4.33335"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M11.5 5.83337H7.16667C6.43029 5.83337 5.83334 6.43033 5.83334 7.16671V11.5C5.83334 12.2364 6.43029 12.8334 7.16667 12.8334H11.5C12.2364 12.8334 12.8333 12.2364 12.8333 11.5V7.16671C12.8333 6.43033 12.2364 5.83337 11.5 5.83337Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Copy;
