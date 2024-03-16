import Skeleton, { type SkeletonProps, SkeletonTheme } from 'react-loading-skeleton';

export const SkeletonLine = (props: SkeletonProps): JSX.Element => (
  <SkeletonTheme baseColor="#202020" highlightColor="#444">
    <Skeleton {...props} style={{ borderRadius: '30px' }} />
  </SkeletonTheme>
);
