const Swap = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.32 9.39998L3.03999 9.39998L6.55999 12.92"
      stroke="currentColor"
      strokeWidth="0.96"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.03999 7.15997L12.32 7.15997L8.79999 3.63997"
      stroke="currentColor"
      strokeWidth="0.96"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Swap;
