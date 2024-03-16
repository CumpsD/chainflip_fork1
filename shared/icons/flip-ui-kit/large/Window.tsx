const Window = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9.82547 4.74971C9.82547 4.33546 9.48963 3.99965 9.07538 3.99969L6.75028 3.99991C5.23144 3.99991 4.00018 5.23117 4.00018 6.75V17.2504C4.00018 18.7692 5.23145 20.0005 6.75028 20.0005H17.2506C18.7695 20.0005 20.0007 18.7692 20.0007 17.2504V14.4433C20.0007 14.0291 19.6649 13.6933 19.2507 13.6933C18.8365 13.6933 18.5007 14.0291 18.5007 14.4433V17.2504C18.5007 17.9408 17.941 18.5004 17.2506 18.5004H6.75028C6.05989 18.5004 5.50023 17.9408 5.50023 17.2504V6.75C5.50023 6.05962 6.0599 5.49996 6.75028 5.49996L9.07552 5.49974C9.48972 5.4997 9.82547 5.16391 9.82547 4.74971Z"
      fill="currentColor"
    />
    <path
      d="M19.2472 10.3218V4.75213H13.1942"
      stroke="currentColor"
      strokeWidth="1.50005"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5377 5.45308L12.3664 11.6243"
      stroke="currentColor"
      strokeWidth="1.50005"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Window;
