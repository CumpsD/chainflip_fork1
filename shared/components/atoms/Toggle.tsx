import { Switch } from '@headlessui/react';
import classNames from 'classnames';

type ToggleProps = {
  enabled: boolean;
  onToggle: (boolean: boolean) => void;
};

export default function Toggle({ enabled, onToggle }: ToggleProps) {
  return (
    <div>
      <Switch
        checked={enabled}
        onChange={onToggle}
        className="group inline-flex h-[16px] w-[30px] cursor-pointer rounded-full border-2 border-transparent bg-cf-gray-4 transition-colors duration-200 ease-in-out"
      >
        <span
          aria-hidden="true"
          className={classNames(
            'inline-block h-[12px] w-[12px] translate-x-0 transform rounded-full  transition duration-200 ease-in-out',
            // group-hover with ui-not-checked is not working
            !enabled && 'group-hover:bg-cf-white',
            enabled && 'translate-x-[14px]  shadow-[0px_0px_4px] shadow-cf-green-1',
            enabled ? 'bg-cf-green-1' :'bg-cf-light-3'
          )}
        />
      </Switch>
    </div>
  );
}
