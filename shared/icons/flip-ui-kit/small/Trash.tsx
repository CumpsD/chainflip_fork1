const Trash = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M4.5 5.16669L5.06077 11.6156C5.12068 12.3046 5.69748 12.8334 6.38909 12.8334H9.61093C10.3025 12.8334 10.8793 12.3046 10.9392 11.6156L11.5 5.16669"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 5.00002V4.50002C6.5 3.76364 7.09693 3.16669 7.83333 3.16669H8.16667C8.90307 3.16669 9.5 3.76364 9.5 4.50002V5.00002"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3.33334 5.16669H12.6667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Trash;
