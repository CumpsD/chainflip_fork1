import React, { useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import Logo from '@/shared/assets/chainflip-logo.svg';
import { Link } from '@/shared/components';
import { ChainflipNetworkBadge } from '@/shared/components/atoms/ChainflipNetworkBadge';
import Banner from '@/shared/components/Banner';
import { ConnectButton } from '@/shared/components/RainbowKit';
import { DotsHorizontalIcon, CloseIcon, GlobeIcon, HamburgerIcon } from '@/shared/icons/large';
import { LightBulbIcon, ChatIcon, HelpIcon } from '@/shared/icons/small';

export const Navbar = (): JSX.Element => {
  const router = useRouter();
  const [openNavModal, setOpenNavmodal] = useState(false);

  const NavLinks = useCallback(
    () => (
      <>
        {/* <Link href="/pools">Pools</Link> */}
        <Link
          href={new URL('/swaps', process.env.NEXT_PUBLIC_EXPLORER_URL).toString()}
          target="_blank"
          className="flex items-center space-x-1 text-14"
        >
          <GlobeIcon />
          <span>Explorer</span>
        </Link>
        <div className="hidden md:flex">
          <ConnectButton />
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button
              type="button"
              className="flex items-center justify-center rounded-md border border-cf-gray-4 bg-black text-cf-light-2 outline-none transition hover:bg-cf-gray-3 hover:text-cf-white data-[state=open]:bg-cf-gray-3 data-[state=open]:text-white"
            >
              <DotsHorizontalIcon className="h-[38px] w-[38px]" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="space-y-2 rounded-md border border-cf-gray-4 bg-cf-gray-3 p-2.5 text-[14px] text-cf-light-3"
              sideOffset={10}
              align="end"
            >
              {[
                {
                  item: 'Help & Support',
                  Icon: HelpIcon,
                  href: 'https://discord.com/channels/824147014140952596/1159396062872743987',
                },
                {
                  item: 'Leave feedback',
                  Icon: ChatIcon,
                  href: 'https://discord.com/channels/824147014140952596/1140570867496132649',
                },
                {
                  item: 'Request a feature',
                  Icon: LightBulbIcon,
                  href: 'https://chainflip.canny.io/feature-requests',
                },
              ].map(({ item, Icon, href }) => (
                <DropdownMenu.Item
                  key={item}
                  className="whitespace-nowrap rounded-md p-1 outline-none transition hover:bg-cf-gray-4 hover:text-white"
                >
                  <a
                    href={href}
                    target="_blank"
                    className="flex items-center gap-x-2"
                    rel="noreferrer"
                  >
                    <Icon />
                    {item}
                  </a>
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </>
    ),
    [],
  );

  return (
    <div className="z-10 flex h-[86px] w-full flex-col items-center justify-center py-6">
      <div className="fixed left-0 top-0 w-full">
        <Banner app="SWAP" />
      </div>

      {!openNavModal && (
        <div className="flex w-full items-center justify-between space-x-3 px-8 2xl:container 2xl:px-0">
          <div className="flex items-center space-x-[25px]">
            <Link href="/">
              <Logo />
            </Link>
            <ChainflipNetworkBadge />
          </div>
          <div className="hidden space-x-4 text-14 text-cf-light-3 md:flex md:items-center">
            <NavLinks />
          </div>
          <div onClick={() => setOpenNavmodal(true)} className="cursor-pointer md:hidden">
            <HamburgerIcon />
          </div>
        </div>
      )}
      {openNavModal && (
        <div className="fixed right-0 top-0 z-20 h-full w-full bg-nav-modal-gradient">
          <div className="z-20 flex flex-col">
            <div className="z-20 flex items-center justify-between space-x-3 p-8">
              <Logo
                className="pointer-events-auto cursor-pointer"
                onClick={() => router.push('/')}
              />
              <div
                className="pointer-events-auto cursor-pointer "
                onClick={() => setOpenNavmodal(false)}
              >
                <CloseIcon className="cursor-pointer" />
              </div>
            </div>
            <img
              src="/mobile-modal-hero.png"
              className="absolute right-0 top-0 z-0 w-6/12"
              alt=""
            />
            <div className="z-20 p-8">
              <div className="pointer-events-auto mt-16 flex flex-col space-y-10">
                <NavLinks />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
