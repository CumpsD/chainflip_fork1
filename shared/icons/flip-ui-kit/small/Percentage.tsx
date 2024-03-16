const Percentage = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 4.5L4.5 11.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.6667 11.5C11.1269 11.5 11.5 11.1269 11.5 10.6666C11.5 10.2064 11.1269 9.83331 10.6667 9.83331C10.2064 9.83331 9.83333 10.2064 9.83333 10.6666C9.83333 11.1269 10.2064 11.5 10.6667 11.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33333 6.16667C5.79357 6.16667 6.16667 5.79357 6.16667 5.33333C6.16667 4.8731 5.79357 4.5 5.33333 4.5C4.8731 4.5 4.5 4.8731 4.5 5.33333C4.5 5.79357 4.8731 6.16667 5.33333 6.16667Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Percentage;
