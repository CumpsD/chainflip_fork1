import { useQuery } from '@apollo/client';
import classNames from 'classnames';
import { gql } from '@/shared/graphql/generated';
import { Link } from './atoms/Link';
import { type App } from '../graphql/generated/graphql';
import { InformationIcon, SparklesIcon, WarningTriangleIcon } from '../icons/small';
import { links } from '../utils';

const BANNER_STATUS_QUERY = gql(/* GraphQL */ `
  query BannerStatus($app: App!) {
    banner: allBanners(filter: { or: [{ app: { equalTo: $app } }, { app: { equalTo: ALL } }] }) {
      nodes {
        message
        type
      }
    }
  }
`);

export default function Banner({ app }: { app: App }): JSX.Element | null {
  const { data } = useQuery(BANNER_STATUS_QUERY, {
    context: { clientName: 'statechainCache' },
    variables: { app },
  });
  const message = data?.banner?.nodes[0]?.message;
  const type = data?.banner?.nodes[0]?.type;

  if (!message || message === '' || !type) return null;

  const displayedMessage = message.endsWith('.') ? message : `${message}.`;

  const icon = {
    INFO: <InformationIcon />,
    WARNING: <WarningTriangleIcon />,
    SUCCESS: <SparklesIcon />,
  } as const;
  const style = {
    INFO: 'text-cf-blue-2 bg-cf-blue-5',
    WARNING: 'text-cf-orange-1 bg-cf-orange-4',
    SUCCESS: 'text-cf-green-1 bg-cf-',
  };
  const linkColor = {
    INFO: 'blue',
    WARNING: 'orange',
    SUCCESS: 'green',
  } as const;

  return (
    <div
      className={classNames(
        `flex w-full items-center justify-center py-[5px] text-center text-12`,
        style[type],
      )}
    >
      <div className="container flex items-center justify-center space-x-1">
        <div>{icon[type]}</div>
        {/* eslint-disable-next-line react/no-danger */}
        <div dangerouslySetInnerHTML={{ __html: displayedMessage }} />
        <div>
          Head to{' '}
          <Link href={links.discord} target="_blank" underline color={linkColor[type]}>
            our discord{' '}
          </Link>
          for more updates
        </div>
      </div>
    </div>
  );
}
