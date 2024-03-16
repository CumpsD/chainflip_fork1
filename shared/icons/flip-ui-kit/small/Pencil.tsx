const Pencil = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16667 12.8333L6.00001 12.1666L12.6327 5.53387C12.8931 5.27351 12.8931 4.85141 12.6327 4.59105L11.4089 3.3672C11.1485 3.10685 10.7265 3.10685 10.4661 3.3672L3.83334 9.99998L3.16667 12.8333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.34894 4.69269L11.3489 6.69271"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Pencil;
