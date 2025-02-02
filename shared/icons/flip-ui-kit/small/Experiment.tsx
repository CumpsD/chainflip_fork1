const Experiment = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M10.8327 3.1665H5.16602L5.82578 3.90873C6.25968 4.39687 6.49935 5.02726 6.49935 5.68037V7.49984L3.16602 12.8332H12.8327L9.49935 7.49984V5.68037C9.49935 5.02726 9.73902 4.39687 10.1729 3.90873L10.8327 3.1665Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66602 10.5H11.3327"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Experiment;
