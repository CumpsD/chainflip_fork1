const Badge = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M9.5 5.83332L12.1667 3.16666H3.83334L6.5 5.83332"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 12.8333C9.933 12.8333 11.5 11.2663 11.5 9.33334C11.5 7.40035 9.933 5.83334 8 5.83334C6.067 5.83334 4.5 7.40035 4.5 9.33334C4.5 11.2663 6.067 12.8333 8 12.8333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Badge;
