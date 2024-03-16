const Award = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M11.5 6.66666C11.5 8.59966 9.93302 10.1667 8.00002 10.1667C6.06702 10.1667 4.50002 8.59966 4.50002 6.66666C4.50002 4.73366 6.06702 3.16666 8.00002 3.16666C9.93302 3.16666 11.5 4.73366 11.5 6.66666Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5.83335 9.83334L5.16669 12.8333L8.00002 11.8333L10.8334 12.8333L10.1667 9.83334"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Award;
