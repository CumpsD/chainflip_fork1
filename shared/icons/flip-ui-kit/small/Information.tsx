const Information = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 8.66669V10"
      stroke="currentColor"
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.00001 6.66665C8.3682 6.66665 8.66668 6.36817 8.66668 5.99998C8.66668 5.63179 8.3682 5.33331 8.00001 5.33331C7.63182 5.33331 7.33334 5.63179 7.33334 5.99998C7.33334 6.36817 7.63182 6.66665 8.00001 6.66665Z"
      fill="currentColor"
    />
    <path
      d="M7.99999 12.8334C10.6694 12.8334 12.8333 10.6694 12.8333 8.00002C12.8333 5.33064 10.6694 3.16669 7.99999 3.16669C5.33061 3.16669 3.16666 5.33064 3.16666 8.00002C3.16666 10.6694 5.33061 12.8334 7.99999 12.8334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Information;
