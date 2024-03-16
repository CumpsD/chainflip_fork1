const Send = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16667 12.8333L8 3.16666L12.8333 12.8333L8 10.5L3.16667 12.8333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 10.3333V8.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default Send;
