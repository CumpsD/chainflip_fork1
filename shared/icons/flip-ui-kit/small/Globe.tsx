const Globe = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8.00002 12.8334C10.6694 12.8334 12.8334 10.6695 12.8334 8.00008C12.8334 5.33071 10.6694 3.16675 8.00002 3.16675C5.33064 3.16675 3.16669 5.33071 3.16669 8.00008C3.16669 10.6695 5.33064 12.8334 8.00002 12.8334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1667 8.00008C10.1667 11.0001 8.82841 12.8334 8.00001 12.8334C7.17161 12.8334 5.83334 11.0001 5.83334 8.00008C5.83334 5.00008 7.17161 3.16675 8.00001 3.16675C8.82841 3.16675 10.1667 5.00008 10.1667 8.00008Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33334 8.00006H8.00001H12.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Globe;
