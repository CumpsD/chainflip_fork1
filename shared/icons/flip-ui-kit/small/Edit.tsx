const Edit = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16666 12.8333L6 12.1667L12.1953 5.9714C12.4556 5.71105 12.4556 5.28894 12.1953 5.02858L10.9714 3.80473C10.7111 3.54438 10.2889 3.54438 10.0286 3.80473L3.83333 9.99999L3.16666 12.8333Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.8333 12.8333H9.16666"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Edit;
