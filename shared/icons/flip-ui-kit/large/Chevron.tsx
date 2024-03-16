import classNames from 'classnames';

type Orientation = 'up-down' | 'left-right';

interface ChevronProps extends React.SVGProps<SVGSVGElement> {
  flip?: boolean;
  transition?: boolean;
  orientation?: Orientation;
}

export default function Chevron({
  flip = false,
  transition = false,
  orientation = 'up-down',
  className,
  ...props
}: ChevronProps = {}): JSX.Element {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
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
        d="M10.75 8.75L14.25 12L10.75 15.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
