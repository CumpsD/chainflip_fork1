import { type ReactNode, useEffect, useState } from 'react';
import { Link } from '@/shared/components';
import { ChainflipNetworkBadge } from '@/shared/components/atoms/ChainflipNetworkBadge';
import { CloseIcon, HamburgerIcon } from '@/shared/icons/large';
import Logo from '../assets/svg/logo-white.svg';

const Navbar = ({
  desktopContent,
  mobileContent,
  logoHref,
}: {
  desktopContent: ReactNode;
  mobileContent: ReactNode;
  logoHref: string;
}): JSX.Element => {
  const [openNavModal, setOpenNavModal] = useState(false);

  useEffect(() => {
    if (openNavModal) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [openNavModal]);

  return (
    <div className="z-10 flex h-[86px] w-full flex-col items-center justify-center border-b border-b-cf-gray-3 py-6 ">
      {!openNavModal && (
        <div className="flex w-full items-center justify-between gap-x-3 px-8 2xl:container 2xl:px-0">
          <div className="flex items-center gap-x-[25px]">
            <Link href={logoHref}>
              <Logo />
            </Link>
            <ChainflipNetworkBadge />
          </div>
          <div className="hidden grow items-center justify-end gap-x-12 text-14 lg:flex">
            {desktopContent}
          </div>
          <div onClick={() => setOpenNavModal(true)} className="cursor-pointer lg:hidden">
            <HamburgerIcon />
          </div>
        </div>
      )}
      {openNavModal && (
        <>
          <div className="flex w-full items-center justify-between px-8">
            <div className="flex items-center gap-x-[25px]">
              <Link href={logoHref}>
                <Logo />
              </Link>
              <ChainflipNetworkBadge />
            </div>
            <button type="button" className="ml-auto" onClick={() => setOpenNavModal(false)}>
              <CloseIcon className="cursor-pointer" />
            </button>
          </div>
          <div className="fixed top-20 z-20 flex h-full w-full flex-col  bg-black px-8 py-4">
            <div className="flex flex-col [&>*]:border-b [&>*]:border-b-cf-gray-3 [&>*]:py-5">
              {mobileContent}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Navbar;
