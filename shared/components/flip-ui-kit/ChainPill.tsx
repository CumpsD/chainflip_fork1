import classNames from 'classnames';
import BitcoinLogo from '@/shared/assets/svg/chainpill-logos/btc.svg';
import PolkadotLogo from '@/shared/assets/svg/chainpill-logos/dot.svg';
import EthereumLogo from '@/shared/assets/svg/chainpill-logos/eth.svg';
import { type ChainflipChain } from '../../utils/chainflip';

const monoChromeLogo: Record<ChainflipChain, JSX.Element> = {
  Bitcoin: <BitcoinLogo />,
  Ethereum: <EthereumLogo />,
  Polkadot: <PolkadotLogo />,
};

const ChainPill = ({ chain }: { chain: ChainflipChain }) => {
  // https://www.figma.com/file/6DpozwFwDYXTu6HFsbijhZ/Flip-UI-Kit?type=design&node-id=1953-2258&mode=dev
  const chainColors: Record<ChainflipChain, string> = {
    Bitcoin: 'bg-[#423225] text-[#F7931B] border border-[#F7931B]/20',
    Ethereum: 'bg-[#252545] text-[#8198EE] border border-[#8198EE]/20',
    Polkadot: 'bg-[#422535] text-[#EA3E99] border border-[#EA3E99]/20',
  };

  return (
    <div
      className={classNames(
        'inline-flex items-center gap-x-0.5 rounded-[30px] px-2 py-0.5 text-12',
        chainColors[chain],
      )}
    >
      <div>{monoChromeLogo[chain]}</div>
      {chain}
    </div>
  );
};

export default ChainPill;
