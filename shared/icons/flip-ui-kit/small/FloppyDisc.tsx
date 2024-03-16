const FloppyDisc = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.49999 12.8334H11.5C12.2364 12.8334 12.8333 12.2365 12.8333 11.5001V6.55237C12.8333 6.19874 12.6929 5.85961 12.4428 5.60955L10.3905 3.55727C10.1405 3.30722 9.80132 3.16675 9.44772 3.16675H4.49999C3.76361 3.16675 3.16666 3.7637 3.16666 4.50008V11.5001C3.16666 12.2365 3.76361 12.8334 4.49999 12.8334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83334 12.6667V10.5C5.83334 10.1318 6.13182 9.83337 6.50001 9.83337H9.50001C9.86821 9.83337 10.1667 10.1318 10.1667 10.5V12.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83334 3.33337V5.50004"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FloppyDisc;
