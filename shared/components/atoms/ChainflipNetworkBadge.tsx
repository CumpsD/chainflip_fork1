import { type CSSProperties } from 'react';
import { GlobeIcon } from '@/shared/icons/small';
import { type ChainflipNetwork, getChainflipNetwork, capitalize } from '@/shared/utils';

const TestnetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.8327 3.1665H5.16602L5.82578 3.90873C6.25968 4.39687 6.49935 5.02726 6.49935 5.68037V7.49984L3.16602 12.8332H12.8327L9.49935 7.49984V5.68037C9.49935 5.02726 9.73902 4.39687 10.1729 3.90873L10.8327 3.1665Z"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.66602 10.5H11.3327"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const badgeStyles: Record<ChainflipNetwork, CSSProperties> = {
  mainnet: {
    color: '#46DA93',
    border: '1px solid #46DA9333',
    background:
      'linear-gradient(93.9deg, #0E2C1D 3.19%, rgba(20, 60, 40, 0.67) 99.48%), linear-gradient(0deg, rgba(70, 218, 147, 0.2), rgba(70, 218, 147, 0.2))',
    boxShadow: '0px 2px 10px 0px #46DA9326',
  },
  perseverance: {
    color: '#FF33AF',
    border: '1px solid #8D165E',
    background:
      'linear-gradient(117deg, rgba(255, 51, 175, 0.20) 0%, rgba(255, 36, 167, 0.28) 100%)',
    boxShadow: '0px 2px 10px 0px rgba(255, 51, 175, 0.25)',
  },
  sisyphos: {
    color: '#A8E5FF',
    border: '1px solid #5485B4',
    background:
      'linear-gradient(108deg, rgba(111, 168, 255, 0.27) 0%, rgba(89, 155, 255, 0.33) 48.96%, rgba(67, 160, 246, 0.34) 100%)',
    boxShadow: '0px 2px 10px 0px rgba(168, 229, 255, 0.25)',
  },
  backspin: {
    color: '#EC9F0A',
    border: '1px solid #5F4104',
    background: '#2F2002',
    boxShadow: '0px 2px 10px 0px rgba(218, 159, 70, 0.25)',
  },
  unknown: {
    color: '#EC9F0A',
    border: '1px solid #5F4104',
    background: '#2F2002',
    boxShadow: '0px 2px 10px 0px rgba(218, 159, 70, 0.25)',
  },
};

const getNetworkName = (network: ChainflipNetwork) => {
  if (network === 'mainnet') return 'Mainnet';
  if (network === 'perseverance') return 'Testnet';
  return capitalize(network);
};

export const ChainflipNetworkBadge = () => {
  const network = getChainflipNetwork();

  const badgeContent = (
    <div className="flex h-[30px] items-center space-x-0.5 p-2">
      {network === 'mainnet' ? <GlobeIcon /> : <TestnetIcon />}
      <div>{getNetworkName(network)}</div>
    </div>
  );

  return (
    <div className="relative rounded-full text-14 font-medium" style={badgeStyles[network]}>
      {badgeContent}
      <div className="absolute left-0 top-0 mix-blend-screen blur-[4.5px]">{badgeContent}</div>
    </div>
  );
};
