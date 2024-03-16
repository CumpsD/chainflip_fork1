const RssFeed = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.66667 12.6666C3.66667 12.8507 3.51743 13 3.33333 13C3.14924 13 3 12.8507 3 12.6666C3 12.4826 3.14924 12.3333 3.33333 12.3333C3.51743 12.3333 3.66667 12.4826 3.66667 12.6666Z"
      stroke="currentColor"
      strokeWidth="0.666667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.16667 8.5H3.33333C5.63452 8.5 7.5 10.3655 7.5 12.6667V12.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.16667 4.5H3.33333C7.84367 4.5 11.5 8.15633 11.5 12.6667V12.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default RssFeed;
