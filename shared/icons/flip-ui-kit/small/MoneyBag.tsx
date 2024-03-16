const MoneyBag = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M6.66667 5.33335C6.66667 5.33335 7 5.50002 8 5.50002C9 5.50002 9.33333 5.33335 9.33333 5.33335C9.33333 5.33335 10.5 3.83335 12 3.83335M3.16667 10C3.16667 12 5.33333 12.8334 8 12.8334C10.6667 12.8334 12.8333 12 12.8333 10C12.8333 8.95669 11.7 7.24669 10.6147 6.48669C9.548 5.74002 8.95 4.41202 9.33333 3.16669H6.66667C7.05 4.41202 6.45267 5.74002 5.38533 6.48735C4.3 7.24735 3.16667 8.95669 3.16667 10Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MoneyBag;
