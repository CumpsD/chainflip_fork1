const ShipmentCheck = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="25"
    height="24"
    viewBox="0 0 25 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15 17.75L16.5 19.25C17.25 17 19.5 15.75 19.5 15.75M11.5 19.25H7C6.46957 19.25 5.96086 19.0393 5.58579 18.6642C5.21071 18.2891 5 17.7804 5 17.25V9.635C4.99985 9.22176 5.12771 8.81862 5.366 8.481L8 4.75H16.5L19.134 8.481C19.3723 8.81862 19.5001 9.22176 19.5 9.635V12.25M5.25 9.25H19.25M12.25 5V9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ShipmentCheck;
