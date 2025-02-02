const Flag = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M5.75 19.25V13.25V19.25ZM5.75 13.25V5.75C5.75 5.75 8.5 3.5 12 5.75C15.5 8 18.25 5.75 18.25 5.75V13.25C18.25 13.25 15.5 15.5 12 13.25C8.5 11 5.75 13.25 5.75 13.25Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Flag;
