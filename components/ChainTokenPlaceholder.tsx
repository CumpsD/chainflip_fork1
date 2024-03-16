import TokenWithChain from '@/shared/components/TokenWithChain';

function TokenLogoPlaceholder(): JSX.Element {
  return (
    <div className="h-[34px] w-[34px] rounded-full bg-cf-gray-4 shadow-[inset_2px_2px_13.25px] shadow-black/25 transition duration-300 group-hover:bg-cf-gray-5" />
  );
}
function ChainLogoPlaceholder(): JSX.Element {
  return (
    <div className="h-4 w-4 rounded-full bg-cf-light-1 shadow-[-2px_-2px_6px_rgba(0,0,0,0.1),inset_1px_1px_7px_rgba(0,0,0,0.25)] transition duration-300 group-hover:bg-cf-light-3" />
  );
}

export default function ChainTokenPlaceholder(): JSX.Element {
  return <TokenWithChain tokenLogo={TokenLogoPlaceholder} chainLogo={ChainLogoPlaceholder} />;
}
