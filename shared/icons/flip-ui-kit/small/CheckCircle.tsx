const CheckCircle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16666 7.99999C3.16666 5.33062 5.33062 3.16666 8 3.16666C10.6694 3.16666 12.8333 5.33062 12.8333 7.99999C12.8333 10.6694 10.6694 12.8333 8 12.8333C5.33062 12.8333 3.16666 10.6694 3.16666 7.99999Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 8.5L6.78913 9.11627C7.01833 9.60467 7.7024 9.6328 7.97093 9.16487L9.5 6.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CheckCircle;
