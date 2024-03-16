const WarningTriangle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.30147 10.9024L6.81014 3.90437C7.30207 2.92319 8.70261 2.92345 9.19421 3.90481L12.6997 10.9029C13.1437 11.7894 12.4991 12.8333 11.5075 12.8333H4.49339C3.50157 12.8333 2.85694 11.789 3.30147 10.9024Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00002 6.66669V8.00002"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00001 11.3333C8.3682 11.3333 8.66668 11.0349 8.66668 10.6667C8.66668 10.2985 8.3682 10 8.00001 10C7.63182 10 7.33334 10.2985 7.33334 10.6667C7.33334 11.0349 7.63182 11.3333 8.00001 11.3333Z"
      fill="currentColor"
    />
  </svg>
);

export default WarningTriangle;
