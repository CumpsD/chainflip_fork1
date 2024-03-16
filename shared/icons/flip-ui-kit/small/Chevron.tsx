import classNames from 'classnames';

type Orientation = 'up-down' | 'left-right';

interface ChevronProps extends React.SVGProps<SVGSVGElement> {
  flip?: boolean;
  transition?: boolean;
  orientation?: Orientation;
}

const Chevron = ({
  flip = false,
  transition = false,
  orientation = 'up-down',
  className,
  ...props
}: ChevronProps = {}): JSX.Element => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={classNames(
      className,
      orientation === 'up-down' && !flip && '-rotate-90',
      orientation === 'up-down' && flip && 'rotate-90',
      orientation === 'left-right' && flip && '-rotate-180',
      transition && 'transition',
    )}
    {...props}
  >
    <path
      d="M7.16666 5.83337L9.49999 8.00004L7.16666 10.1667"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Chevron;
