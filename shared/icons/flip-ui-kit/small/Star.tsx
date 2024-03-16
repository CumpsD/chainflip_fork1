const Star = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.99999 3.16669L9.16666 6.83335H12.8333L9.83332 9.16669L10.8333 12.8334L7.99999 10.5L5.16666 12.8334L6.16666 9.16669L3.16666 6.83335H6.83332L7.99999 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Star;
