const Clock = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.00001 12.8334C10.6694 12.8334 12.8333 10.6694 12.8333 8.00002C12.8333 5.33064 10.6694 3.16669 8.00001 3.16669C5.33063 3.16669 3.16667 5.33064 3.16667 8.00002C3.16667 10.6694 5.33063 12.8334 8.00001 12.8334Z"
      stroke="currentColor"
    />
    <path d="M8 5.33337V8.00004L9.33333 9.33337" stroke="currentColor" />
  </svg>
);

export default Clock;
