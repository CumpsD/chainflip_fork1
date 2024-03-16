const Tag = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.99999 6.66665C10.3682 6.66665 10.6667 6.36817 10.6667 5.99998C10.6667 5.63179 10.3682 5.33331 9.99999 5.33331C9.63181 5.33331 9.33333 5.63179 9.33333 5.99998C9.33333 6.36817 9.63181 6.66665 9.99999 6.66665Z"
      fill="currentColor"
    />
    <path
      d="M8.00001 3.16669H12.8333V8.00002L8.36901 12.4472C7.83628 12.9779 6.97041 12.9634 6.4558 12.4151L3.52663 9.29402C3.02695 8.76162 3.04844 7.92635 3.57485 7.42035L8.00001 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Tag;
