import { useMemo } from 'react';
import {
  type AvatarComponent,
  ConnectButton as RainbowButton,
  RainbowKitProvider,
  darkTheme,
  connectorsForWallets,
} from '@rainbow-me/rainbowkit';
import {
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  rainbowWallet,
  walletConnectWallet,
  xdefiWallet,
  rabbyWallet,
  subWallet,
  talismanWallet,
  bitgetWallet,
} from '@rainbow-me/rainbowkit/wallets';
import classNames from 'classnames';
import {
  type Address,
  type Chain,
  WagmiConfig,
  configureChains,
  createConfig,
  useAccount,
} from 'wagmi';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { isTruthy } from '@/shared/utils';
import { baseStyles, disabledStyles, hoverStyles } from './flip-ui-kit/Button';
import { isTestnet } from '../featureFlags';
import useTracking from '../hooks/useTracking';
import { SharedEvents, type SharedTrackEvents } from '../types';

const generateGradient = (address: Address) => {
  let hue1 = 0;
  try {
    hue1 = Number(BigInt(address) % 360n);
  } catch {
    // pass
  }
  const hue2 = (hue1 + 180) % 360;
  const saturation = 75;
  const lightness = 50;
  const color = `hsl(${hue1} ${saturation}% ${lightness}%)`;
  const color2 = `hsl(${hue2} ${saturation}% ${lightness}%)`;
  return `linear-gradient(135deg, ${color} 6.7%, ${color2} 95%)`;
};

export const ConnectAvatar: AvatarComponent = ({ ensImage, size, address }) => {
  if (ensImage) {
    return <img alt="Avatar" src={ensImage} width={size} height={size} className="rounded-full" />;
  }

  const background = generateGradient(address as Address);

  return <div className="rounded-full" style={{ background, width: size, height: size }} />;
};

type ButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
> & { connected?: boolean };

const Button = ({ className, children, connected = false, ...rest }: ButtonProps) => (
  <button
    {...rest}
    className={classNames(
      className,
      'h-10 min-w-[130px] rounded-md px-4 text-14 transition duration-300',
      'hover:cursor-pointer hover:disabled:cursor-default',
      'font-aeonikMedium font-medium outline-none',
      !connected && baseStyles['primary-standard'],
      !connected && hoverStyles['primary-standard'],
      !connected && disabledStyles['primary-standard'],
      connected && 'border border-cf-gray-4 bg-black text-cf-light-3',
      connected && 'hover:bg-cf-gray-2 hover:text-cf-white',
    )}
    type="button"
  >
    {children}
  </button>
);

export const ConnectButton = () => {
  const track = useTracking<SharedTrackEvents>();
  const { connector } = useAccount();

  return (
    <RainbowButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted, openAccountModal }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        let onClick;
        let content;

        if (!connected) {
          onClick = openConnectModal;
          content = 'Connect Wallet';
        } else if (chain.unsupported) {
          onClick = openChainModal;
          content = 'Unsupported network';
        } else {
          track(SharedEvents.ConnectWallet, {
            props: {
              connectedWallet: account.address,
              walletProvider: connector?.name ?? '',
              path: window.location.pathname,
            },
          });
          onClick = openAccountModal;
          content = (
            <div className="flex items-center justify-center space-x-2">
              {chain.hasIcon && (
                <div
                  className="h-4 w-4 overflow-hidden rounded-full"
                  style={{ background: chain.iconBackground }}
                >
                  {chain.iconUrl && (
                    <img
                      alt={chain.name ?? 'Chain icon'}
                      src={chain.iconUrl}
                      style={{ width: 16, height: 16 }}
                    />
                  )}
                </div>
              )}
              <span>{account.ensName ?? account.displayName}</span>
              <ConnectAvatar size={16} address={account.address} ensImage={account.ensAvatar} />
            </div>
          );
        }

        return (
          <Button onClick={onClick} connected={connected && !chain.unsupported}>
            {content}
          </Button>
        );
      }}
    </RainbowButton.Custom>
  );
};

function mainnetWallet<T>(wallet: T): T[] {
  if (isTestnet) {
    return [];
  }

  return [wallet];
}

export const Provider = ({
  children,
  wagmiChains,
}: {
  children: React.ReactNode;
  wagmiChains: Chain[];
}) => {
  const wagmiConfig = useMemo(() => {
    const providers = [
      process.env.NEXT_PUBLIC_INFURA_API_KEY
        ? infuraProvider({ apiKey: process.env.NEXT_PUBLIC_INFURA_API_KEY })
        : undefined,
      publicProvider(),
    ].filter(isTruthy);

    const { chains, publicClient, webSocketPublicClient } = configureChains(wagmiChains, providers);
    const projectId = '9d94e593343f9901d073e88eb0c28c18';
    const wallets = [
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      ...mainnetWallet(rabbyWallet({ chains })),
      metaMaskWallet({ chains, projectId }),
      ...mainnetWallet(xdefiWallet({ chains })),
      okxWallet({ chains, projectId }),
      coinbaseWallet({ chains, appName: 'Chainflip' }),
      subWallet({ chains, projectId }),
      bitgetWallet({ chains, projectId }),
      talismanWallet({ chains }),
    ];
    const connectors = connectorsForWallets([{ groupName: 'Recommended', wallets }]);

    const config = createConfig({
      autoConnect: true,
      connectors,
      publicClient,
      webSocketPublicClient,
    });

    return { chains, config };
  }, wagmiChains);

  return (
    <WagmiConfig config={wagmiConfig.config}>
      <RainbowKitProvider chains={wagmiConfig.chains} theme={darkTheme()} avatar={ConnectAvatar}>
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
};
