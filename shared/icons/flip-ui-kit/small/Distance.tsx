const Distance = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.33333 10.3333L2 8.16667L4.33333 6"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M2 8.16666H9" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path
      d="M11.6667 6L14 8.16667L11.6667 10.3333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 8.16666H7" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Distance;
