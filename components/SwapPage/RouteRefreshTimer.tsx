import WhiteSpinner from '@/shared/animations/spinner-white.json';
import { Tooltip } from '@/shared/components';
import { Rotate2Icon } from '@/shared/icons/small';
import Lottie from '@/shared/utils/Lottie';

export const RouteRefreshTimer = ({
  isRefreshing,
  secondsUntilNextRefresh,
}: {
  isRefreshing: boolean;
  secondsUntilNextRefresh: string;
}) => (
  <div className="flex items-center gap-x-2">
    <Tooltip
      content="Route info refreshes every 30s"
      tooltipClassName="w-[240px]"
      pointer={false}
      tabable={false}
    >
      <div className="flex h-[24px] w-[24px] items-center justify-center rounded-[100%] border border-cf-gray-5  bg-cf-gray-4 transition ease-in hover:rotate-[30deg]">
        {isRefreshing ? (
          <Lottie
            className="p-1"
            as="span"
            speed={isRefreshing ? 2 : 0.5}
            animationData={WhiteSpinner}
            autoplay
            loop
          />
        ) : (
          <Rotate2Icon className="text-cf-green-3" />
        )}
      </div>
    </Tooltip>
    <span className="font-aeonikMono text-12 text-cf-light-2">
      {!isRefreshing ? secondsUntilNextRefresh : '00'}s
    </span>
  </div>
);
