const PlusCircle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3 8C3 5.23858 5.23858 3 8 3C10.7614 3 13 5.23858 13 8C13 10.7614 10.7614 13 8 13C5.23858 13 3 10.7614 3 8Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M8 6V10" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 8H6" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default PlusCircle;
