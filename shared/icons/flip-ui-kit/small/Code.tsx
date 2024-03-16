const Code = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 3.16669H4.50002C3.76364 3.16669 3.16669 3.76364 3.16669 4.50002V11.5C3.16669 12.2364 3.76364 12.8334 4.50002 12.8334H11.5C12.2364 12.8334 12.8334 12.2364 12.8334 11.5V4.50002C12.8334 3.76364 12.2364 3.16669 11.5 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83334 7.16669L7.50001 8.66669L5.83334 10.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Code;
