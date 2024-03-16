const SpeechBubble = (props: React.SVGProps<SVGSVGElement>): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M8 12.1667C10.5773 12.1667 12.8333 10.7702 12.8333 7.66669C12.8333 4.56324 10.5773 3.16669 8 3.16669C5.42267 3.16669 3.16667 4.56324 3.16667 7.66669C3.16667 8.84502 3.49189 9.77729 4.03643 10.4804C4.19572 10.6862 4.25901 10.9595 4.14873 11.1951C4.08157 11.3386 4.01089 11.4756 3.93861 11.6055C3.63579 12.1495 4.05301 12.9421 4.66351 12.8198C5.34087 12.6842 6.09835 12.4814 6.73027 12.1826C6.8622 12.1202 7.00893 12.096 7.15367 12.1143C7.43 12.1494 7.713 12.1667 8 12.1667Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SpeechBubble;
