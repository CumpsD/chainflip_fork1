const Droplet = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 9.38095C11.5 11.2877 9.933 12.8334 8 12.8334C6.06701 12.8334 4.5 11.2877 4.5 9.38095C4.5 7.47429 8 3.16669 8 3.16669C8 3.16669 11.5 7.47429 11.5 9.38095Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Droplet;
