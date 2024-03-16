const AnnotationWarning = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16667 4.49999C3.16667 3.76361 3.76363 3.16666 4.50001 3.16666H11.5C12.2364 3.16666 12.8333 3.76361 12.8333 4.49999V9.49999C12.8333 10.2364 12.2364 10.8333 11.5 10.8333H9.75001L8.00001 12.8333L6.25001 10.8333H4.50001C3.76363 10.8333 3.16667 10.2364 3.16667 9.49999V4.49999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 5.33334V6.66668"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33334 8.66668C8.33334 8.85074 8.18407 9.00001 8.00001 9.00001C7.81594 9.00001 7.66667 8.85074 7.66667 8.66668C7.66667 8.48261 7.81594 8.33334 8.00001 8.33334C8.18407 8.33334 8.33334 8.48261 8.33334 8.66668Z"
      stroke="currentColor"
      strokeWidth="0.666667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default AnnotationWarning;
