import { Fragment, type ReactNode } from 'react';
import classNames from 'classnames';
import { Link } from '@/shared/components';
import NotFound from '@/shared/components/NotFound';
import { ArrowIcon } from '@/shared/icons/small';

export const Layout = ({
  children,
  resourceNotFound = false,
  breadcrumbs,
  navbar,
  className,
}: {
  resourceNotFound?: boolean;
  children: ReactNode;
  breadcrumbs?: { text: string; href?: string }[];
  navbar?: JSX.Element;
  className?: string;
}): JSX.Element => (
  <div className={classNames('flex min-h-screen flex-col', className)}>
    <div className="flex w-full grow flex-col items-center">
      {navbar}
      <div className="container flex w-full grow flex-col space-y-4 px-4 py-8 md:px-0">
        {Boolean(breadcrumbs?.length) && (
          <div className="flex flex-row items-center space-x-1 text-12 text-cf-light-2">
            {breadcrumbs?.map((breadcrumb, index) => (
              <Fragment key={breadcrumb.text}>
                {index > 0 && <ArrowIcon direction="right" />}
                {breadcrumb.href ? (
                  <Link href={breadcrumb.href} color="light">
                    {breadcrumb.text}
                  </Link>
                ) : (
                  <div>{breadcrumb.text}</div>
                )}
              </Fragment>
            ))}
          </div>
        )}
        <div className="relative flex grow flex-col items-center justify-center">
          {resourceNotFound ? <NotFound /> : children}
        </div>
      </div>
    </div>
  </div>
);
