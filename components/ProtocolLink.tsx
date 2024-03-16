import { ContractSuccessIcon } from '@/shared/icons/large';

export default function ProtocolLink({
  disabled = false,
  protocolLink,
  protocolName,
}: {
  disabled?: boolean;
  protocolLink: string | undefined;
  protocolName: string;
}): JSX.Element {
  if (!protocolLink) return <span>{protocolName}</span>;

  return (
    <a
      aria-disabled={disabled}
      className="mx-1 flex items-end text-cf-light-3 underline"
      href={protocolLink}
    >
      <ContractSuccessIcon className="text-cf-blue-3" width={17} height={17} />
      {protocolName}
    </a>
  );
}
