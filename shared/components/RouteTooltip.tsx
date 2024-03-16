import classNames from 'classnames';
import TokenWithChain from '@/shared/components/TokenWithChain';
import { ArrowIcon, ScrollIcon, RouteIcon } from '@/shared/icons/large';
import { TokenAmount, chainflipAssetMap } from '@/shared/utils';
import {
  type ChainflipAsset,
  type ChainflipChain,
  assetToChainMap,
  assetToLogoMap,
  chainToLogoMap,
} from '@/shared/utils/chainflip';

export const LogoWithAmount = ({
  chainLogo,
  tokenLogo,
  amount,
  disabled = false,
}: {
  chainLogo: () => JSX.Element;
  tokenLogo: () => JSX.Element;
  amount?: string;
  disabled?: boolean;
}) => (
  <div className={classNames('flex items-center space-x-2', disabled && 'opacity-30')}>
    <TokenWithChain small chainLogo={chainLogo} tokenLogo={tokenLogo} />
    <div className="font-aeonikMono text-12 text-cf-white">{amount ?? '??'}</div>
  </div>
);

type RouteStep = {
  inChain: ChainflipChain;
  outChain: ChainflipChain;
  inAsset: ChainflipAsset;
  outAsset: ChainflipAsset;
  inAmount: TokenAmount;
  outAmount: TokenAmount;
};

type Swap = {
  depositAmount: string;
  destinationAsset: ChainflipAsset;
  egressAmount?: string | null | undefined;
  intermediateAmount?: string | null | undefined;
  sourceAsset: ChainflipAsset;
};

const RouteTooltip = ({ swap, type }: { swap: Swap; type: 'Route' | 'Order' }) => {
  const sourceChain = assetToChainMap[swap.sourceAsset];
  const destinationChain = assetToChainMap[swap.destinationAsset];
  const depositAmount = TokenAmount.fromAsset(swap.depositAmount, swap.sourceAsset);
  const intermediateAmount = TokenAmount.fromAsset(swap.intermediateAmount, 'Usdc');
  const egressAmount = TokenAmount.fromAsset(swap.egressAmount, swap.destinationAsset);

  const routeSteps = [] as RouteStep[];

  if (depositAmount?.gt(0) && intermediateAmount?.gt(0) && egressAmount?.gt(0)) {
    routeSteps.push(
      {
        inChain: sourceChain,
        outChain: 'Ethereum',
        inAsset: swap.sourceAsset,
        outAsset: 'Usdc',
        inAmount: depositAmount,
        outAmount: intermediateAmount,
      },
      {
        inChain: 'Ethereum',
        outChain: destinationChain,
        inAsset: 'Usdc',
        outAsset: swap.destinationAsset,
        inAmount: intermediateAmount,
        outAmount: egressAmount,
      },
    );
  } else if (depositAmount?.gt(0) && egressAmount?.gt(0)) {
    routeSteps.push({
      inChain: sourceChain,
      outChain: destinationChain,
      inAsset: swap.sourceAsset,
      outAsset: swap.destinationAsset,
      inAmount: depositAmount,
      outAmount: egressAmount,
    });
  }

  return (
    <div className="flex min-w-[280px] flex-col space-y-4 p-2">
      <div className="flex items-center space-x-1 text-cf-white">
        {type === 'Order' ? <ScrollIcon /> : <RouteIcon />}
        <div className="font-aeonikMedium text-16">{type} Details</div>
      </div>
      {routeSteps.map((step) => (
        <div key={step.inAsset} className="flex flex-col space-y-4">
          <div key={step.inAmount?.toFixedDisplay()} className="flex items-center space-x-2">
            <LogoWithAmount
              chainLogo={chainToLogoMap[step.inChain]}
              tokenLogo={assetToLogoMap[step.inAsset]}
              amount={step.inAmount?.toFixedDisplay()}
            />
            <ArrowIcon width={16} className="text-cf-light-2" />
            <LogoWithAmount
              chainLogo={chainToLogoMap[step.outChain]}
              tokenLogo={assetToLogoMap[step.outAsset]}
              amount={step.outAmount?.toFixedDisplay()}
            />
          </div>
          <div className="text-12 text-cf-light-3">
            <div>
              {`Swap ${step.inAmount?.toFixedDisplay()} ${
                chainflipAssetMap[step.inAsset].symbol
              } on ${step.inChain} for ${step.outAmount?.toFixedDisplay()} ${
                chainflipAssetMap[step.outAsset].symbol
              } on ${step.outChain}`}
            </div>
          </div>
        </div>
      ))}
      <div className="text-12 text-cf-light-3">
        {depositAmount.gt(0) &&
          egressAmount?.gt(0) &&
          `Rate: 1 ${chainflipAssetMap[swap.sourceAsset].symbol} ≈ ${egressAmount
            .ratio(depositAmount)
            .toFixed(8)} ${chainflipAssetMap[swap.destinationAsset].symbol}`}
      </div>
    </div>
  );
};

export default RouteTooltip;
