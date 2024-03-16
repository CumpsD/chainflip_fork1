const ClosedBook = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.8333 10.1667V3.83332C12.8333 3.46514 12.5349 3.16666 12.1667 3.16666H4.49999C3.76361 3.16666 3.16666 3.76361 3.16666 4.49999V11.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.8333 10.1667H4.49999C3.76361 10.1667 3.16666 10.7636 3.16666 11.5C3.16666 12.2364 3.76361 12.8333 4.49999 12.8333H12.8333V10.1667Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ClosedBook;
