import classNames from 'classnames';
import LoadingSpinner from './LoadingSpinner';

export default function GraphLoader({
  loading,
  className,
  children,
  style,
}: {
  loading: boolean;
  className?: string;
  children: JSX.Element;
  style?: React.CSSProperties;
}) {
  return (
    <div className={classNames(className, 'relative')} style={style}>
      {children}
      <div
        className={classNames(
          'absolute inset-0 flex h-full w-full items-center justify-center',
          'before:absolute before:inset-0 before:flex before:h-full before:w-full before:backdrop-blur-[1px]',
          !loading && 'hidden',
        )}
      >
        <LoadingSpinner />
      </div>
    </div>
  );
}
