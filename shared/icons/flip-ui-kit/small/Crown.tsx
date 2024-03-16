const Crown = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16667 10.8334V3.83337L6 7.50004L8 3.83337L10 7.50004L12.8333 3.83337V10.8334C12.8333 10.8334 12 12.1667 8 12.1667C4 12.1667 3.16667 10.8334 3.16667 10.8334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Crown;
