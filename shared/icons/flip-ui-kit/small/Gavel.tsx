const Gavel = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.66666 9.50008L3.83333 6.66675L4.66666 5.83341L4.99999 6.16675L6.66666 4.50008L6.33333 4.16675L7.33333 3.16675L10.1667 6.00008L9.33333 6.83341L9 6.50008L7.16666 8.33341L7.5 8.66675L6.66666 9.50008Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 8.00006L12.8333 12.8334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.16667 12.5001V12.8334H8.83334V12.5001C8.83334 11.7637 8.23641 11.1667 7.50001 11.1667H4.50001C3.76363 11.1667 3.16667 11.7637 3.16667 12.5001Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 5.33337L8 7.33337"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Gavel;
