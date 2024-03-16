const Flag = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.83333 12.8333V8.83332V12.8333ZM3.83333 8.83332V3.83332C3.83333 3.83332 5.66667 2.33332 8 3.83332C10.3333 5.33332 12.1667 3.83332 12.1667 3.83332V8.83332C12.1667 8.83332 10.3333 10.3333 8 8.83332C5.66667 7.33332 3.83333 8.83332 3.83333 8.83332Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Flag;
