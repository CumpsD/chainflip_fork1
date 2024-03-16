const Qr = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.83333 12.8333H4.5C3.76362 12.8333 3.16667 12.2364 3.16667 11.5V11.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.83333 8.5H5.5C6.23638 8.5 6.83333 9.09693 6.83333 9.83333V10.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.1667 9.83334H10.5C10.1318 9.83334 9.83334 10.1318 9.83334 10.5V12.1667C9.83334 12.5349 10.1318 12.8333 10.5 12.8333H12.1667C12.5349 12.8333 12.8333 12.5349 12.8333 12.1667V10.5C12.8333 10.1318 12.5349 9.83334 12.1667 9.83334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8.5 7.5H12.8333" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M8.5 5.16666H10.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5 3.16666H11.5C12.2364 3.16666 12.8333 3.76361 12.8333 4.49999V5.49999"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.5 3.16666H3.83333C3.46515 3.16666 3.16667 3.46514 3.16667 3.83332V5.49999C3.16667 5.86818 3.46515 6.16666 3.83333 6.16666H5.5C5.86819 6.16666 6.16667 5.86818 6.16667 5.49999V3.83332C6.16667 3.46514 5.86819 3.16666 5.5 3.16666Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Qr;
