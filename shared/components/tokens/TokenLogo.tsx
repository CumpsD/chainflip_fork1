import {
  BtcLogo,
  DotLogo,
  EthLogo,
  FlipLogo,
  MaticLogo,
  NotFound,
  UsdcLogo,
} from '../../assets/token-logos';
import {
  beth$,
  bflip$,
  btc$,
  busdc$,
  dot$,
  eth$,
  flip$,
  geth$,
  gusdc$,
  matic$,
  mumbaiMatic$,
  pdot$,
  tbtc$,
  tflip$,
  type Token,
  usdc$,
} from '../../assets/tokens';
import { formatIpfsUrl } from '../../utils/strings';

const tokenLogo: Record<Token['symbol'], (props?: React.SVGProps<SVGSVGElement>) => JSX.Element> = {
  [eth$.symbol]: EthLogo,
  [btc$.symbol]: BtcLogo,
  [dot$.symbol]: DotLogo,
  [matic$.symbol]: MaticLogo,
  [flip$.symbol]: FlipLogo,
  [usdc$.symbol]: UsdcLogo,
  [geth$.symbol]: EthLogo,
  [tbtc$.symbol]: BtcLogo,
  [pdot$.symbol]: DotLogo,
  [mumbaiMatic$.symbol]: MaticLogo,
  [tflip$.symbol]: FlipLogo,
  [gusdc$.symbol]: UsdcLogo,
  [bflip$.symbol]: FlipLogo,
  [busdc$.symbol]: UsdcLogo,
  [beth$.symbol]: EthLogo,
};

export const TokenLogo = ({
  token,
  className,
  height = 34,
  width = 34,
}: {
  token: Pick<Token, 'symbol' | 'logo'>;
  className?: string;
  height?: number;
  width?: number;
}) => {
  if (!tokenLogo[token.symbol]) {
    return (
      <div className={className} style={{ height: `${height}px`, width: `${width}px` }}>
        {typeof token.logo === 'string' && token.logo.length > 1 ? (
          <img className="rounded-[100%]" src={formatIpfsUrl(token.logo)} alt="" />
        ) : (
          <NotFound width={width} height={height} />
        )}
      </div>
    );
  }
  return (
    <div className={className} style={{ height: `${height}px`, width: `${width}px` }}>
      {tokenLogo[token.symbol]({ width, height })}
    </div>
  );
};
