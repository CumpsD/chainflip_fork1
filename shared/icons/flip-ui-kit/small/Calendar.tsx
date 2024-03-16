const Calendar = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16669 5.83333C3.16669 5.09695 3.76364 4.5 4.50002 4.5H11.5C12.2364 4.5 12.8334 5.09695 12.8334 5.83333V11.5C12.8334 12.2364 12.2364 12.8333 11.5 12.8333H4.50002C3.76364 12.8333 3.16669 12.2364 3.16669 11.5V5.83333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33334 3.16666V5.49999"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 3.16666V5.49999"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.16669 7.16666H10.8334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Calendar;
