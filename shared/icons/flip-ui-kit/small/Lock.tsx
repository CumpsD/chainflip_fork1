const Lock = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.83334 7.83335C3.83334 7.46515 4.13182 7.16669 4.5 7.16669H11.5C11.8682 7.16669 12.1667 7.46515 12.1667 7.83335V11.5C12.1667 12.2364 11.5697 12.8334 10.8333 12.8334H5.16667C4.43029 12.8334 3.83334 12.2364 3.83334 11.5V7.83335Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.16667 7.00002V6.89515C5.16667 5.85433 5.10405 4.69419 5.83097 3.94929C6.24553 3.52449 6.91633 3.16669 8 3.16669C9.08367 3.16669 9.75447 3.52449 10.169 3.94929C10.8959 4.69419 10.8333 5.85433 10.8333 6.89515V7.00002"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Lock;
