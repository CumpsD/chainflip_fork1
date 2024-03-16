import React, { Fragment, type SVGProps } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { ChevronIcon } from '@/shared/icons/large';

export type SelectedDropdownOption<T> = {
  icon: JSX.Element | ((props: React.SVGProps<SVGSVGElement>) => JSX.Element);
  label: string;
  value: T;
};

const SelectedDropdown = <T,>({
  options,
  selected,
  setSelected,
  showOptionIcon = true,
  showSeparator = true,
}: {
  options: readonly SelectedDropdownOption<T>[];
  selected: SelectedDropdownOption<T>;
  setSelected: (option: SelectedDropdownOption<T>) => void;
  showOptionIcon?: boolean;
  showSeparator?: boolean;
}) => (
  <Listbox value={selected} onChange={setSelected}>
    {({ open }) => (
      <div className="relative text-14">
        <Listbox.Button
          className={classNames(
            'flex h-9 w-[160px] flex-grow items-center justify-between rounded-md border border-cf-gray-4 px-2 py-1 text-14 text-cf-light-3',
            'group transition hover:bg-cf-gray-4',
            open ? 'bg-cf-gray-4' : 'bg-cf-gray-2',
          )}
        >
          <div className="flex items-center space-x-2">
            {typeof selected.icon === 'function' ? <selected.icon /> : selected.icon}
            <span>{selected.label}</span>
          </div>
          <ChevronIcon
            flip={!open}
            className={classNames('transition group-hover:text-cf-white', open && 'text-cf-white')}
          />
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options
            className="absolute z-10 mt-1 w-full rounded-md bg-cf-gray-4"
            style={{
              boxShadow: '0px 12px 23px 0px #0000008A',
            }}
          >
            {options.map((option) => (
              <Listbox.Option
                key={option.label}
                value={option}
                className={classNames(
                  'flex cursor-pointer items-center space-x-2 border-cf-gray-5 p-2 transition first-of-type:border-b hover:text-white',
                  showSeparator && 'border-b last-of-type:border-0',
                )}
              >
                {showOptionIcon && (
                  <div>{typeof option.icon === 'function' ? <option.icon /> : option.icon}</div>
                )}
                <div>{option.label}</div>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    )}
  </Listbox>
);

export default SelectedDropdown;
