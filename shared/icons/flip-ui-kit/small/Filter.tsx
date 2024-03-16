const Filter = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.8334 3.16666H3.16669L6.20785 6.96812C6.39698 7.20452 6.50002 7.49826 6.50002 7.80106V12.1667C6.50002 12.5349 6.79849 12.8333 7.16669 12.8333H8.83335C9.20155 12.8333 9.50002 12.5349 9.50002 12.1667V7.80106C9.50002 7.49826 9.60309 7.20452 9.79222 6.96812L12.8334 3.16666Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Filter;
