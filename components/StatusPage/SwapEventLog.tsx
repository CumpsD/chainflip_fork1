import classNames from 'classnames';
import { motion } from 'framer-motion';
import { MacScrollbar } from 'mac-scrollbar';
import { Link } from '@/shared/components';
import Hourglass from '@/shared/icons/flip-ui-kit/small/Hourglass';
import { CheckmarkIcon, CloseIcon } from '@/shared/icons/large';
import { type EventLog, type StatusResponse } from '../../integrations';

const checkmark = <CheckmarkIcon width={16} height={16} className="text-cf-green-1" />;
const error = <CloseIcon width={16} height={16} className="text-cf-red-1" />;
const processingIcon = <Hourglass className="text-cf-orange-2" />;

const variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

const LogItem = ({ log, index }: { log: EventLog; index: number }) => (
  <motion.div
    layout
    variants={variants}
    initial={index === 0 ? 'hidden' : 'show'}
    animate="show"
    className="flex space-x-2"
  >
    <div className="flex items-start space-x-3">
      <div className="h-[18px] w-[18px] shrink-0">
        {log.status === 'processing' && processingIcon}
        {log.status === 'success' && checkmark}
        {log.status === 'error' && error}
      </div>
      <div className="flex flex-col space-y-2">
        <div className="text-cf-light-4">{log.message}</div>
        {log.link && (
          <div className="flex items-center space-x-1">
            {log.logo && (
              <span className="-ml-1">
                {log.logo({
                  width: 16,
                  height: 16,
                })}
              </span>
            )}
            <span className="ml-2 text-cf-light-2 transition-colors duration-150 ease-out hover:cursor-pointer hover:text-white">
              <Link target="_blank" href={log.link}>
                {log.linkTitle ?? 'View event'}
              </Link>
            </span>
          </div>
        )}
      </div>
    </div>
  </motion.div>
);

export default function SwapEventLog({
  status,
  className,
}: {
  status: StatusResponse;
  className?: string;
}) {
  if (!status.eventLogs.length) return null;

  return (
    <div
      className={classNames('flex items-start justify-start font-aeonikMono text-12', className)}
    >
      <div
        className="bg-holy-radial-gray-3-60 relative h-full w-full overflow-hidden rounded-md border border-cf-gray-4 backdrop-blur"
        style={{ maxHeight: 'inherit' }}
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-b from-transparent to-cf-gray-2" />
        <MacScrollbar
          skin="dark"
          className="flex h-full w-full flex-col space-y-2 px-5 pb-6 pt-4"
          style={{ maxHeight: 'inherit' }}
        >
          {status.eventLogs.map((log, index) => (
            <LogItem key={log.message} log={log} index={index} />
          ))}
        </MacScrollbar>
      </div>
    </div>
  );
}
