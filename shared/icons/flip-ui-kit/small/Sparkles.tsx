const Sparkles = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 3.16669C10 5.00763 9.0076 6.66669 7.16666 6.66669C9.0076 6.66669 10 8.32575 10 10.1667C10 8.32575 10.9924 6.66669 12.8333 6.66669C10.9924 6.66669 10 5.00763 10 3.16669Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.33333 8.5C5.33333 9.6046 4.27123 10.6667 3.16666 10.6667C4.27123 10.6667 5.33333 11.7287 5.33333 12.8333C5.33333 11.7287 6.39543 10.6667 7.5 10.6667C6.39543 10.6667 5.33333 9.6046 5.33333 8.5Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Sparkles;
