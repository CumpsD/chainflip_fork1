const TimePreviousIcon = (props: Record<string, string>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13 18.25C14.2361 18.25 15.4445 17.8834 16.4723 17.1967C17.5001 16.5099 18.3012 15.5338 18.7742 14.3918C19.2473 13.2497 19.3711 11.9931 19.1299 10.7807C18.8887 9.56831 18.2935 8.45466 17.4194 7.58059C16.5453 6.70651 15.4317 6.11125 14.2193 5.87009C13.0069 5.62894 11.7503 5.75271 10.6082 6.22576C9.46619 6.6988 8.49007 7.49988 7.80331 8.52769C7.11656 9.5555 6.75 10.7639 6.75 12V14.385M8.5 13.5L7 15.25L5 13.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M12 9V13L14.5 14.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);
export default TimePreviousIcon;
