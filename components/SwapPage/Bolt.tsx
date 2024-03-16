const Bolt = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="41"
    height="44"
    viewBox="0 0 41 44"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#filter0_f_6723_29792)">
      <path
        d="M19.25 23.25H15.25L21.75 14.75V20.75H25.75L19.25 29.25V23.25Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <filter
        id="filter0_f_6723_29792"
        x="-5.5"
        y="-4"
        width="52"
        height="52"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feGaussianBlur stdDeviation="7" result="effect1_foregroundBlur_6723_29792" />
      </filter>
    </defs>
  </svg>
);
export default Bolt;
