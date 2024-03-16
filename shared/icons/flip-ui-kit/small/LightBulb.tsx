const LightBulb = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 3.16669C5.66667 3.16669 4.5 5.00002 4.5 6.66669C4.5 9.33335 6.5 9.66669 6.5 10.6667V12.167C6.5 12.5352 6.79847 12.8334 7.16667 12.8334H8.83333C9.20153 12.8334 9.5 12.5352 9.5 12.167V10.6667C9.5 9.66669 11.5 9.33335 11.5 6.66669C11.5 5.00002 10.3333 3.16669 8 3.16669Z"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.66666 11.1667H9.33333"
      stroke="white"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default LightBulb;
