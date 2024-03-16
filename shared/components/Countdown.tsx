import intervalToDuration from 'date-fns/intervalToDuration';
import { pad } from '@/shared/utils';

const Countdown = (
  props:
    | {
        timestamp: Date | undefined;
        now: number;
      }
    | { duration: Duration },
) => {
  let duration;
  if ('timestamp' in props) {
    if (props.timestamp === undefined) return null;
    duration = intervalToDuration({
      start: props.now,
      end: props.timestamp,
    });
  } else {
    duration = props.duration;
  }

  return (
    <div className="flex flex-col">
      <div
        style={{ width: '340px' }}
        className="rounded-md bg-cf-gray-3 px-4 text-28 tracking-widest"
      >
        <div className="flex w-full">
          <div>{pad(duration.days ?? 0)}:</div>
          <div>{pad(duration.hours ?? 0)}:</div>
          <div>{pad(duration.minutes ?? 0)}:</div>
          <div>{pad(duration.seconds ?? 0)}</div>
        </div>
      </div>
      <div className="mt-3 flex flex-row justify-evenly text-sm uppercase tracking-widest text-cf-light-1">
        <div>days</div>
        <div>hours</div>
        <div>min</div>
        <div>sec</div>
      </div>
    </div>
  );
};

export default Countdown;
