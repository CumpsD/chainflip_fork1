import classNames from 'classnames';

type Direction = 'up' | 'down' | 'left' | 'right';

type Props = React.SVGProps<SVGSVGElement> & { direction?: Direction };

const ArrowIcon = ({ className, direction, ...props }: Props): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
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
      d="M9.16667 4.5L12.8333 8L9.16667 11.5"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.6667 8H3.16667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default ArrowIcon;
