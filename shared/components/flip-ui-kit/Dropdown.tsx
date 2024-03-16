import { useEffect } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Button, Link } from '@/shared/components';
import { useMobile } from '@/shared/hooks';
import { ChevronIcon } from '@/shared/icons/large';
import { ArrowIcon } from '@/shared/icons/small';

type DropdownItem = {
  label: string;
  icon?: React.ReactNode;
  href: string;
  target?: string;
  action?: string;
  onClick?: () => void;
  comingSoon?: boolean;
};

type DropdownCTA = {
  label: string;
  href: string;
};

type DropdownProps = {
  title: string;
  items: DropdownItem[];
  isActive: boolean;
  cta?: DropdownCTA;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
};

const animate = {
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.2,
    },
    display: 'block',
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: {
      duration: 0.3,
    },
    transitionEnd: {
      display: 'none',
    },
  },
};

const ComingSoonPill = () => (
  <div className="inline-flex h-6 items-center gap-x-0.5 rounded-[30px] border border-cf-green-1/20 bg-cf-green-4 px-2 py-1 text-12 text-cf-green-1">
    Soon
  </div>
);

const DropdownItemContent = ({ item }: { item: DropdownItem }) => (
  <div className="flex cursor-pointer items-center gap-x-2 lg:px-2 lg:py-1">
    <div className="hidden rounded-md border border-cf-gray-4 bg-cf-gray-3 lg:block">
      {item.icon}
    </div>
    <span className={classNames(item.comingSoon ? 'text-cf-light-1' : 'text-white')}>
      {item.label}
    </span>
    {item.comingSoon && <ComingSoonPill />}
  </div>
);
const Dropdown = ({
  title,
  items,
  isActive,
  cta,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: DropdownProps) => {
  const isMobile = useMobile();

  useEffect(() => {
    animate.enter.transition.duration = isMobile ? 0 : 0.2;
    animate.exit.transition.duration = isMobile ? 0 : 0.3;
  }, [isMobile]);

  return (
    <motion.div onMouseLeave={onMouseLeave} onClick={onClick}>
      <motion.div
        onMouseEnter={onMouseEnter}
        className={classNames(
          'group flex cursor-default items-center justify-between lg:justify-normal',
          isActive && 'text-cf-white',
        )}
      >
        {title} <ChevronIcon flip={!isActive} transition />
      </motion.div>
      <motion.div
        initial="exit"
        animate={isActive ? 'enter' : 'exit'}
        variants={animate}
        className="mb-2 mt-6 flex w-full min-w-[170px] flex-col space-y-6 rounded-md text-16 text-cf-white lg:absolute lg:m-0 lg:w-max lg:space-y-2 lg:border lg:border-cf-gray-3 lg:bg-cf-gray-2 lg:p-2 lg:text-14"
        style={{
          boxShadow: '0px 12px 23px 0px rgba(0, 0, 0, 0.54)',
          backdropFilter: 'blur(15px)',
        }}
      >
        {items.map((item) => (
          <div
            key={item.label}
            className={classNames('rounded-md', !item.comingSoon && 'hover:bg-cf-gray-4')}
          >
            {item.comingSoon ? (
              <DropdownItemContent item={item} />
            ) : (
              <Link
                href={item.href}
                target={item.target}
                onClick={item.onClick}
                className="pointer-events-auto"
              >
                <DropdownItemContent item={item} />
              </Link>
            )}
          </div>
        ))}
        {cta && (
          <div>
            <Link href={cta.href} target="_blank">
              <Button
                className="hidden w-full items-center gap-x-1 lg:flex"
                iconPos="right"
                icon={<ArrowIcon className="-rotate-45" />}
                size="small"
              >
                {cta.label}
              </Button>
              <div className="lg:hidden">
                <DropdownItemContent item={cta} />
              </div>
            </Link>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Dropdown;
