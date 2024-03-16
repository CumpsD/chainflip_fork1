const MoneyBag = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10 8C10 8 10.5 8.25 12 8.25C13.5 8.25 14 8 14 8C14 8 15.75 5.75 18 5.75M4.75 15C4.75 18 8 19.25 12 19.25C16 19.25 19.25 18 19.25 15C19.25 13.435 17.55 10.87 15.922 9.73C14.322 8.61 13.425 6.618 14 4.75H10C10.575 6.618 9.679 8.61 8.078 9.731C6.45 10.871 4.75 13.435 4.75 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MoneyBag;
