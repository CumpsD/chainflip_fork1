import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import qrcode from 'qrcode';
import { chainTransparentLogo } from '@/shared/assets/chains/logo';
import { CopyButton, Toggle } from '@/shared/components';
import { type StatusResponse } from '../../../integrations';
import Card from '../../Card';

function QRCode({ content, width }: { content: string; width: number }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (ref.current && width) {
      qrcode.toCanvas(ref.current, content, { margin: 1, width });
    }
  }, [content, width]);

  return <canvas className="w-full rounded-md" ref={ref} />;
}

export default function DepositAddressCard({ status }: { status: StatusResponse }) {
  const [showQr, setShowQr] = useState(false);
  const qrRef = useRef<HTMLDivElement | null>(null);

  if (!status.depositAddress) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="inline-flex items-center space-x-1 rounded-md border border-cf-gray-5 bg-cf-gray-4 px-2 py-1 text-12 text-white">
        {chainTransparentLogo[status.srcToken.chain.id]?.({
          width: '14',
          height: '14',
        })}
        <span>{status.srcToken.chain.name} Network</span>
      </div>
      <Card className="mt-[-12px] space-y-2 bg-cf-gray-2 p-4 pt-8 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Toggle enabled={showQr} onToggle={setShowQr} />
            <span className="text-12 ">Show QR</span>
          </div>
          <CopyButton
            textToCopy={status.depositAddress}
            className={classNames('transition', showQr && 'pointer-events-none opacity-0')}
          />
        </div>
        {!showQr && (
          <div
            data-testid="deposit-address"
            className="break-words text-justify font-aeonikMono text-14"
          >
            {status.depositAddress}
          </div>
        )}
        <div
          ref={qrRef}
          className="relative space-y-2 overflow-hidden"
          style={{ height: showQr ? qrRef.current?.clientWidth : 'auto' }}
        >
          <div
            className={classNames(
              'absolute top-0 overflow-hidden transition',
              showQr ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0',
            )}
          >
            <QRCode content={status.depositAddress} width={qrRef.current?.clientWidth ?? 0} />
          </div>
        </div>
      </Card>
    </div>
  );
}
