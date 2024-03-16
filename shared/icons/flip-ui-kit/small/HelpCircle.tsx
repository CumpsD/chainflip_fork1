const HelpCircle = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12.8333 8.00008C12.8333 10.6695 10.6694 12.8334 8 12.8334C5.33062 12.8334 3.16666 10.6695 3.16666 8.00008C3.16666 5.33071 5.33062 3.16675 8 3.16675C10.6694 3.16675 12.8333 5.33071 12.8333 8.00008Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6.5 6.66675C6.5 6.66675 6.66667 5.16675 8 5.16675C9.33333 5.16675 9.5 6.00008 9.5 6.66675C9.5 7.16761 9.21773 7.66855 8.6532 7.88668C8.3098 8.01935 8 8.29855 8 8.66675V8.83341"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8.33333 10.6667C8.33333 10.8508 8.18406 11 8 11C7.81593 11 7.66666 10.8508 7.66666 10.6667C7.66666 10.4826 7.81593 10.3334 8 10.3334C8.18406 10.3334 8.33333 10.4826 8.33333 10.6667Z"
      stroke="currentColor"
      strokeWidth="0.666667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default HelpCircle;
