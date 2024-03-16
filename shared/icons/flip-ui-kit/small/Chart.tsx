const Chart = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16669 4.49999C3.16669 3.76361 3.76364 3.16666 4.50002 3.16666H11.5C12.2364 3.16666 12.8334 3.76361 12.8334 4.49999V11.5C12.8334 12.2364 12.2364 12.8333 11.5 12.8333H4.50002C3.76364 12.8333 3.16669 12.2364 3.16669 11.5V4.49999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83334 10.1667V6.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1667 10.1667V6.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00002 10.1667V8.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Chart;
