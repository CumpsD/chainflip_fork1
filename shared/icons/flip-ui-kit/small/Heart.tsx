const Heart = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.99667 4.82218C7.03033 3.74004 5.41888 3.44895 4.2081 4.43986C2.99733 5.43078 2.82687 7.08752 3.77769 8.25952L7.99667 12.1667L12.2157 8.25952C13.1665 7.08752 13.0169 5.42036 11.7853 4.43986C10.5537 3.45938 8.96307 3.74004 7.99667 4.82218Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Heart;
