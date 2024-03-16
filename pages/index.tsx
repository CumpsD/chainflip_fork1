import { motion } from 'framer-motion';
import RouteList from '../components/SwapPage/RouteList/RouteList';
import SwapCard from '../components/SwapPage/SwapCard';
import { ChainBalancesProvider } from '../hooks/useChainBalances';
import { RoutesProvider } from '../hooks/useRoutes';
import useStore, { selectShowRouteList } from '../hooks/useStore';
import { TokensProvider } from '../hooks/useTokens';

const animateDetails = {
  enter: {
    opacity: 1,
    x: '0%',
    scale: 1,
  },
  exit: {
    opacity: [1, 0.8, 0.3, 0],
    x: '-5%',
    scale: 0.9,
  },
};

export default function Index(): JSX.Element {
  const showRouteList = useStore(selectShowRouteList);

  return (
    <div className="flex justify-center">
      <TokensProvider>
        <ChainBalancesProvider>
          <RoutesProvider>
            <div className="flex items-center space-x-6">
              <motion.div
                initial={false}
                animate={
                  showRouteList
                    ? { x: '0%' }
                    : { x: '47%', transition: { delay: 0.1, duration: 0.3 } }
                }
              >
                <SwapCard />
              </motion.div>
              <motion.div
                style={{ pointerEvents: showRouteList ? 'auto' : 'none' }}
                initial={false}
                animate={showRouteList ? 'enter' : 'exit'}
                variants={animateDetails}
                transition={{
                  type: 'spring',
                  damping: 15,
                  stiffness: 90,
                  restDelta: 0.01,
                  mass: 1,
                }}
              >
                <RouteList />
              </motion.div>
            </div>
          </RoutesProvider>
        </ChainBalancesProvider>
      </TokensProvider>
    </div>
  );
}
