const Clipboard = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6 4.50003H5.16666C4.43028 4.50003 3.83333 5.09698 3.83333 5.83336V11.5C3.83333 12.2364 4.43028 12.8334 5.16666 12.8334H10.8333C11.5697 12.8334 12.1667 12.2364 12.1667 11.5V5.83336C12.1667 5.09698 11.5697 4.50003 10.8333 4.50003H10"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.33333 5.50002H6.66667C6.29848 5.50002 6 5.20154 6 4.83335V3.83335C6 3.46517 6.29848 3.16669 6.66667 3.16669H9.33333C9.70153 3.16669 10 3.46517 10 3.83335V4.83335C10 5.20154 9.70153 5.50002 9.33333 5.50002Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6.5 8.16669H9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 10.1667H9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Clipboard;
