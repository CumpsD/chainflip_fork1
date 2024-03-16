import React from 'react';
import classNames from 'classnames';
import { SkeletonLine } from '../atoms/LoadingSkeleton';

export interface StatPanelProps {
  children: JSX.Element[];
  isLoading?: boolean;
  flexDirection?: 'row' | 'col';
  className?: string;
}

export function StatPanel({
  children,
  isLoading,
  flexDirection = 'row',
  className,
}: StatPanelProps): JSX.Element {
  return (
    <div
      className={classNames(
        'h-full w-full rounded-md border border-cf-gray-4 bg-cf-gray-2 p-4',
        className,
      )}
    >
      <div
        className={classNames(
          'flex h-full items-center justify-between',
          flexDirection !== 'row' && 'flex-col',
        )}
      >
        {isLoading
          ? React.Children.map(children, () => (
              <div className="flex w-1/2 items-center space-x-4">
                <span className="w-10/12">
                  <SkeletonLine height={40} />
                </span>
              </div>
            ))
          : children}
      </div>
    </div>
  );
}
