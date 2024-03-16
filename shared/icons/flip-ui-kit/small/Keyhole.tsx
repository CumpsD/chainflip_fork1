const Keyhole = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3.16669C6.43519 3.16669 5.16667 4.43521 5.16667 6.00002C5.16667 7.33335 6.31856 8.15369 6.83333 8.66669L4.5 12.8334H11.5L9.16667 8.67362C9.68147 8.16062 10.8333 7.33335 10.8333 6.00002C10.8333 4.43521 9.5648 3.16669 8 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Keyhole;
