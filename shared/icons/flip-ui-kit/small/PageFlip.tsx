const PageFlip = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 12.8333C10.6667 12.8333 12.8333 11.5 12.8333 11.5V3.83331M8 12.8333C5.33333 12.8333 3.16667 11.5 3.16667 11.5V3.83331C3.16667 3.83331 5.66667 4.49998 8 4.49998V12.8333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4.50002C9.66667 4.50002 10.8333 3.16669 10.8333 3.16669V11.3334C10.8333 11.3334 9.66667 12.6667 8 12.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default PageFlip;
