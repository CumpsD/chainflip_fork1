const Crown = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.75 16.25V5.75L9 11.25L12 5.75L15 11.25L19.25 5.75V16.25C19.25 16.25 18 18.25 12 18.25C6 18.25 4.75 16.25 4.75 16.25Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Crown;
