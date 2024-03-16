const Piggy = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.16667 9.33334V7.33334C3.16667 6.96514 3.46515 6.66664 3.83333 6.66664H4.5C4.5 6.66664 4.5 4.49998 6.66667 4.49998V3.16664C6.66667 3.16664 8 2.99998 8 4.49998H10.1667C11.6394 4.49998 12.8333 5.69388 12.8333 7.16667V8.83334C12.8333 10.3061 11.6394 11.5 10.1667 11.5H6C4.5 11.5 4.5 10 4.5 10H3.83333C3.46515 10 3.16667 9.70147 3.16667 9.33334Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M7 7.33333C7 7.5174 6.85073 7.66667 6.66667 7.66667C6.48257 7.66667 6.33333 7.5174 6.33333 7.33333C6.33333 7.14927 6.48257 7 6.66667 7C6.85073 7 7 7.14927 7 7.33333Z"
      stroke="currentColor"
      strokeWidth="0.666667"
    />
    <path
      d="M5.83333 11.6667V12.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.1667 11.6667V12.8333"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Piggy;
