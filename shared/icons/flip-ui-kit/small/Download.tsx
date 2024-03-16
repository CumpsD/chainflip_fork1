const Download = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16666 9.83334V10.8333C3.16666 11.9379 4.0621 12.8333 5.16666 12.8333H10.8333C11.9379 12.8333 12.8333 11.9379 12.8333 10.8333V9.83334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 9.49999V3.16666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83334 7.16666L8 9.49999L10.1667 7.16666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Download;
