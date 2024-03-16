const CloseCircle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16667 7.99999C3.16667 5.33062 5.33063 3.16666 8 3.16666C10.6694 3.16666 12.8333 5.33062 12.8333 7.99999C12.8333 10.6694 10.6694 12.8333 8 12.8333C5.33063 12.8333 3.16667 10.6694 3.16667 7.99999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M6.5 6.5L9.5 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.5 6.5L6.5 9.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CloseCircle;
