const Flare = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 2C8.11715 5.26395 10.736 7.88285 14 8C10.736 8.11715 8.11715 10.736 8 14C7.88285 10.736 5.26395 8.11715 2 8C5.26395 7.88285 7.88285 5.26395 8 2Z"
      fill="currentColor"
    />
  </svg>
);

export default Flare;
