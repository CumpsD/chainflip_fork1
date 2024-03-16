const Annotation = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16669 4.49999C3.16669 3.76361 3.76364 3.16666 4.50002 3.16666H11.5C12.2364 3.16666 12.8334 3.76361 12.8334 4.49999V10.1667C12.8334 10.9031 12.2364 11.5 11.5 11.5H9.75002L8.00002 12.8333L6.25002 11.5H4.50002C3.76364 11.5 3.16669 10.9031 3.16669 10.1667V4.49999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Annotation;
