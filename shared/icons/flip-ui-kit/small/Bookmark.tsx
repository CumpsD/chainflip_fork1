const Bookmark = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.5 4.49999C4.5 3.76361 5.09695 3.16666 5.83333 3.16666H10.1667C10.9031 3.16666 11.5 3.76361 11.5 4.49999V12.8333L8 9.83332L4.5 12.8333V4.49999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Bookmark;
