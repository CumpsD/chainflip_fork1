const Bell = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 7.99999V6.66666C11.5 4.73366 9.933 3.16666 8 3.16666C6.067 3.16666 4.5 4.73366 4.5 6.66666V7.99999L3.16666 10.8333H12.8333L11.5 7.99999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 11.1667C6 11.1667 6 12.8333 8 12.8333C10 12.8333 10 11.1667 10 11.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Bell;
