const Book = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.8333 3.83332C12.8333 3.46514 12.5349 3.16666 12.1667 3.16666H9.33333C8.59693 3.16666 8 3.76361 8 4.49999V12.8333L8.55227 12.2811C9.0524 11.7809 9.73067 11.5 10.4379 11.5H12.1667C12.5349 11.5 12.8333 11.2015 12.8333 10.8333V3.83332Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.16666 3.83332C3.16666 3.46514 3.46514 3.16666 3.83332 3.16666H6.66666C7.40306 3.16666 7.99999 3.76361 7.99999 4.49999V12.8333L7.44772 12.2811C6.94759 11.7809 6.26933 11.5 5.56209 11.5H3.83332C3.46514 11.5 3.16666 11.2015 3.16666 10.8333V3.83332Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Book;
