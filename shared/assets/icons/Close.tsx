export const CloseIcon = (props: Record<string, string>): JSX.Element => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="9" cy="9" r="9" fill="#2B2B2B" />
    <path d="M12.5 5.5L5.5 12.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5.5 5.5L12.5 12.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
