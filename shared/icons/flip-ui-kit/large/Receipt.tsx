const Receipt = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.75 4.75H5.75V19.25L7.349 18.007C7.53223 17.8644 7.75938 17.79 7.99147 17.7966C8.22356 17.8031 8.44613 17.8903 8.621 18.043L10 19.25L11.341 18.076C11.5234 17.9162 11.7576 17.8281 12 17.8281C12.2424 17.8281 12.4766 17.9162 12.659 18.076L14 19.25L15.379 18.043C15.5539 17.8903 15.7764 17.8031 16.0085 17.7966C16.2406 17.79 16.4678 17.8644 16.651 18.007L18.25 19.25V10.25M13.75 4.75L18.25 10.25M13.75 4.75V8.25C13.75 8.78043 13.9607 9.28914 14.3358 9.66421C14.7109 10.0393 15.2196 10.25 15.75 10.25H18.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Receipt;
