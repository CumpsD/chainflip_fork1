const FingerSwipe = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M7.87507 7.49999L8.1056 4.07465C8.13867 3.58336 7.74907 3.16666 7.25667 3.16666C6.8252 3.16666 6.46207 3.4896 6.41165 3.9181L5.83339 8.83332L4.76422 7.55152C4.35629 7.06246 3.61411 7.03586 3.17215 7.49439C3.16885 7.49779 3.16788 7.50286 3.16967 7.50726L4.4889 10.7546C4.99945 12.0113 6.22064 12.8333 7.57713 12.8333H10.1667C11.6395 12.8333 12.8334 11.6394 12.8334 10.1667V9.49999C12.8334 8.39539 11.9379 7.49999 10.8334 7.49999H7.87507Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.5104 3.83325C11.8962 4.22831 12.8333 4.83325 12.8333 4.83325M3.33334 4.66665C3.33334 4.66665 3.56667 4.35317 4.16667 4.1145L3.33334 4.66665Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FingerSwipe;
