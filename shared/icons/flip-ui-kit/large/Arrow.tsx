import classNames from 'classnames';

type Direction = 'up' | 'down' | 'left' | 'right';

type Props = React.SVGProps<SVGSVGElement> & { direction?: Direction };

const ArrowIcon = ({ className, direction, ...props }: Props): JSX.Element => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
    className={classNames(
      className,
      direction === 'up' && '-rotate-90',
      direction === 'down' && 'rotate-90',
      direction === 'left' && 'rotate-180',
    )}
  >
    <path
      d="M13.75 6.75L19.25 12L13.75 17.25"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M19 12H4.75"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowIcon;
