const Gift = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.83333 7.50006H12.1667V11.5001C12.1667 12.2365 11.5697 12.8334 10.8333 12.8334H5.16666C4.43028 12.8334 3.83333 12.2365 3.83333 11.5001V7.50006Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.16667 5.16675H12.8333V7.50008H3.16667V5.16675Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12.6667V7.66675"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 5.00008L10.1667 3.16675"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7.66666 5.00008L5.83333 3.16675"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Gift;
