import classNames from 'classnames';
import { Tooltip } from '../molecules/Tooltip';

type Key = 'isCurrentAuthority' | 'isCurrentBackup' | 'isBidding' | 'isQualified' | 'isKeyholder';

export const ValidatorBadges = ({
  cacheValidator,
  keys,
  halfOpacity = false,
}: {
  cacheValidator: ({ [K in Key]: boolean } & { apyBp?: number | null | undefined }) | undefined;
  keys?: Key[];
  halfOpacity?: boolean;
}) => {
  if (!cacheValidator) return null;

  const isBackupEarningRewards = cacheValidator.isCurrentBackup && Boolean(cacheValidator.apyBp);

  const validator = {
    ...cacheValidator,
    isCurrentBackup: isBackupEarningRewards,
  };

  return (
    <>
      {[
        {
          key: 'isCurrentAuthority' as const,
          colors: 'text-cf-green-1 border-cf-green-1/20 bg-cf-green-4',
          tooltip: (
            <div>
              Authorities are responsible for block authorship, consensus, witnessing, threshold
              signing and transaction broadcasting. In return, they earn FLIP.{' '}
              <a
                className="underline"
                target="_blank"
                href="https://docs.chainflip.io/concepts/validator-network/validator-types-and-states"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          ),
        },
        {
          key: 'isCurrentBackup' as const,
          colors: 'border-cf-pink-1/20 text-cf-pink-1 bg-cf-pink-1/20',
          tooltip: (
            <div>
              A Backup is among the highest bidding non-Authorities, earning FLIP in return.{' '}
              <a
                className="underline"
                target="_blank"
                href="https://docs.chainflip.io/concepts/validator-network/validator-types-and-states"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          ),
        },
        {
          key: 'isBidding' as const,
          tooltip: (
            <div>
              A Bidding validator is indicating its intention to participate in the next auction.{' '}
              <a
                className="underline"
                target="_blank"
                href="https://docs.chainflip.io/concepts/validator-network/validator-types-and-states"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          ),
        },
        {
          key: 'isQualified' as const,
          tooltip: (
            <div>
              A Qualified validator can participate in auctions.{' '}
              <a
                className="underline"
                target="_blank"
                href="https://docs.chainflip.io/concepts/validator-network/validator-types-and-states"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          ),
        },
        {
          key: 'isKeyholder' as const,
          tooltip: (
            <div>
              A Keyholder holds a fragment of an unexpired threshold signing key from a previous
              Authority Set.{' '}
              <a
                className="underline"
                target="_blank"
                href="https://docs.chainflip.io/concepts/validator-network/validator-types-and-states"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          ),
        },
      ]
        .filter(({ key }) => keys?.includes(key) ?? true)
        .map(
          ({ key, colors, tooltip }) =>
            validator[key] && (
              <Tooltip key={key} content={tooltip}>
                <div
                  key={key}
                  className={classNames(
                    'rounded-full border px-2 py-[5px] font-aeonikMedium text-12',
                    colors ?? 'border-cf-gray-4 bg-cf-gray-3-5 text-white',
                    halfOpacity && 'opacity-50',
                  )}
                >
                  {key.replace(/is(Current)?/, '')}
                </div>
              </Tooltip>
            ),
        )}
      {cacheValidator.isCurrentAuthority && !cacheValidator.isBidding && (
        <Tooltip
          content={
            <div>
              A Retiring (non-bidding) validator is indicating its intention to retire from the next
              auction.{' '}
              <a
                className="underline"
                target="_blank"
                href="https://docs.chainflip.io/concepts/validator-network/validator-types-and-states"
                rel="noreferrer"
              >
                Learn more
              </a>
            </div>
          }
        >
          <div
            className={classNames(
              'rounded-full border border-cf-red-1/20 bg-cf-red-4 px-2 py-[5px] font-aeonikMedium text-12 text-cf-red-1',
              halfOpacity && 'opacity-50',
            )}
          >
            Retiring
          </div>
        </Tooltip>
      )}
    </>
  );
};
