import { type ChainId } from '@/shared/assets/chains/index';
import { type Token } from '@/shared/assets/tokens/index';
import { TokenLogo } from './TokenLogo';
import { chainLogo } from '../../assets/chains/logo';
import TokenWithChain from '../TokenWithChain';

export type LogoToken = Pick<Token, 'logo' | 'symbol'> & {
  chain: { id: ChainId };
};

function ChainTokenLogo({
  token,
  small = false,
}: {
  token: LogoToken;
  small?: boolean;
}): JSX.Element {
  return (
    <TokenWithChain
      chainLogo={chainLogo[token.chain.id]}
      tokenLogo={<TokenLogo token={token} width={small ? 24 : 32} height={small ? 24 : 32} />}
      small={small}
    />
  );
}

export default ChainTokenLogo;
