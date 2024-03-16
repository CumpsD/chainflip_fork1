const Announcement = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.8333 6.66666C12.8333 8.48592 11.9 10.1667 11 10.1667C10.1 10.1667 9.16666 8.48592 9.16666 6.66666C9.16666 4.84736 10.1 3.16666 11 3.16666C11.9 3.16666 12.8333 4.84736 12.8333 6.66666Z"
      stroke="currentColor"
    />
    <path
      d="M11 10.1667C11 10.1667 5.33333 8.99999 4.66666 8.83332C4 8.66666 3.16666 7.79286 3.16666 6.66666C3.16666 5.54043 4 4.66666 4.66666 4.49999C5.33333 4.33332 11 3.16666 11 3.16666"
      stroke="currentColor"
    />
    <path
      d="M4.5 9V11.5C4.5 12.2364 5.09695 12.8333 5.83333 12.8333H6.16667C6.90307 12.8333 7.5 12.2364 7.5 11.5V9.66667"
      stroke="currentColor"
    />
  </svg>
);

export default Announcement;
