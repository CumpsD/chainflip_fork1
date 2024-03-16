const Link = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.1667 8.83333L12 8C13.1046 6.89539 13.1046 5.10456 12 3.99999C10.8954 2.89543 9.10462 2.89543 8.00002 3.99999L7.16669 4.83333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.83336 7.16669L4.00003 8.00002C2.89546 9.10462 2.89546 10.8954 4.00003 12C5.10459 13.1046 6.89543 13.1046 8.00003 12L8.83336 11.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.50002 6.5L6.50002 9.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Link;
