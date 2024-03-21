import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { Callout } from '@/shared/components';
import useBoolean from '@/shared/hooks/useBoolean';
import ChainflipStatusCardContent from './ChainflipStatusCard';
import ThirdPartyStatusCard from './ThirdPartyStatusCard';
import { type StatusResponse } from '../../integrations';
import Card from '../Card';

export default function SwapStatusCard({ status: propsStatus }: { status: StatusResponse }) {
  const [displayedStatus, setDisplayedStatus] = useState(propsStatus);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);
  const [contentHeight, setContentHeight] = useState<number>();
  const { value: showDepositChannelWarning, setValue: setShowDepositChannelWarning } =
    useBoolean(false);

  useEffect(() => {
    const isDepositAddressCreation =
      !displayedStatus.integrationData && propsStatus.integrationData;
    const isFirstConfirmation =
      !displayedStatus.srcConfirmationCount && propsStatus.srcConfirmationCount;

    // update card content without blink if the swap status did not change
    if (
      displayedStatus.status === propsStatus.status &&
      !isDepositAddressCreation &&
      !isFirstConfirmation
    ) {
      setDisplayedStatus(propsStatus);
    } else if (propsStatus.status !== 'waiting_for_src_tx') {
      setShowDepositChannelWarning(false);
    }
  }, [propsStatus]);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setContentHeight(entry.contentRect.height);
    });
    if (contentRef) observer.observe(contentRef);

    return () => observer.disconnect();
  }, [contentRef]);

  return (
    <div className="flex flex-col space-y-2">
      {showDepositChannelWarning && (
        <Callout type="warning">
          <div className="w-[265px] pl-1 font-aeonikMedium text-14">
            Only send {displayedStatus.srcToken.symbol} to this address while the channel is open to
            avoid a <span className="underline">loss of funds</span>
          </div>
        </Callout>
      )}
      <Card
        className={classNames(
          propsStatus.status === 'failed' ? 'bg-holy-radial-gray-4-60' : 'bg-holy-radial-gray-3-60',
          'flex min-h-[270px] items-center p-5 text-center',
        )}
      >
        <div className="w-full">
          <motion.div
            animate={{ opacity: displayedStatus !== propsStatus ? 0 : 1 }}
            transition={{
              duration: 0.3,
              delay: displayedStatus !== propsStatus ? 0 : 0.3,
            }}
            onAnimationComplete={() => {
              setDisplayedStatus(propsStatus);
            }}
          >
            <motion.div
              animate={{ height: contentHeight }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 150,
                mass: 0.4,
              }}
              className="overflow-hidden"
            >
              <div ref={setContentRef}>
                {displayedStatus.integration === 'chainflip' ? (
                  <ChainflipStatusCardContent
                    status={displayedStatus}
                    setShowDepositChannelWarning={setShowDepositChannelWarning}
                  />
                ) : (
                  <ThirdPartyStatusCard status={displayedStatus} />
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Card>
    </div>
  );
}
