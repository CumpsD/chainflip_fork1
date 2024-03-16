const File = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.16668 12.8333H10.8333C11.5697 12.8333 12.1667 12.2364 12.1667 11.5V5.99999L9.33334 3.16666H5.16668C4.4303 3.16666 3.83334 3.76361 3.83334 4.49999V11.5C3.83334 12.2364 4.4303 12.8333 5.16668 12.8333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 6.16668H9.16669V3.33334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default File;
