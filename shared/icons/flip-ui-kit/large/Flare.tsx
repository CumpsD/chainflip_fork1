const Flare = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M12 3C12.1757 7.89593 16.1041 11.8243 21 12C16.1041 12.1757 12.1757 16.1041 12 21C11.8243 16.1041 7.89593 12.1757 3 12C7.89593 11.8243 11.8243 7.89593 12 3Z"
      fill="currentColor"
    />
  </svg>
);

export default Flare;
