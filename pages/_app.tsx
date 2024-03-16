import '@/shared/utils/prelude';
import 'mac-scrollbar/dist/mac-scrollbar.css';
import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Script from 'next/script';
import { ApolloProvider } from '@apollo/client/react';
import * as Sentry from '@sentry/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { chains } from '@/shared/assets/chains';
import FallbackLayout from '@/shared/components/organisms/FallbackLayout';
import { Provider as RainbowKitProvider } from '@/shared/components/RainbowKit';
import { getGraphqlClient } from '@/shared/graphql/client';
import { PriceOracleProvider } from '@/shared/hooks';
import usePlausible from '@/shared/hooks/usePlausible';
import { getChainflipNetwork, initSentry, isTruthy } from '@/shared/utils';
import Layout from '../components/Layout';
import { SWAPPING_APP_DOMAINS } from '../utils/consts';

initSentry();
const graphQlClient = getGraphqlClient('processor');
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  usePlausible();

  const network = getChainflipNetwork();
  const domain = SWAPPING_APP_DOMAINS[network === 'unknown' ? 'perseverance' : network];
  const ogType = network === 'mainnet' ? 'mainnet' : 'testnet';

  return (
    <>
      <Head>
        <link rel="icon" href="/chainflip-favicon.ico" sizes="any" />
        <link rel="icon" href="/chainflip-favicon.svg" type="image/svg+xml" />

        <title>Chainflip Swap</title>
        <meta
          name="description"
          content="An efficient cross-chain AMM enabling native asset swaps without wrapped tokens or specialized wallets"
        />

        <meta property="og:url" content={`https://${domain}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Chainflip Swap" />
        <meta
          property="og:description"
          content="An efficient cross-chain AMM enabling native asset swaps without wrapped tokens or specialized wallets"
        />
        <meta property="og:image" content={`https://${domain}/chainflip-${ogType}-og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="twitter:domain" content={domain} />
        <meta property="twitter:url" content={`https://${domain}`} />
        <meta name="twitter:title" content="Chainflip Swap" />
        <meta
          name="twitter:description"
          content="An efficient cross-chain AMM enabling native asset swaps without wrapped tokens or specialized wallets"
        />
        <meta name="twitter:image" content={`https://${domain}/chainflip-${ogType}-og.png`} />
      </Head>
      <Script
        id="next-plausible-init"
        dangerouslySetInnerHTML={{
          __html: `window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) }`,
        }}
      />
      <QueryClientProvider client={queryClient}>
        <Sentry.ErrorBoundary
          // eslint-disable-next-line react/no-unstable-nested-components
          fallback={({ error, resetError }) => (
            <FallbackLayout
              message={error.message}
              onClose={resetError}
              title="An unexpected error has occured on our end. Please try again later."
              homeLabel="Home"
              refreshLabel="Refresh"
            />
          )}
        >
          <RainbowKitProvider
            wagmiChains={chains.map((chain) => chain.wagmiChain).filter(isTruthy)}
          >
            <ApolloProvider client={graphQlClient}>
              <PriceOracleProvider>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
                <Toaster theme="dark" richColors />
              </PriceOracleProvider>
            </ApolloProvider>
          </RainbowKitProvider>
        </Sentry.ErrorBoundary>
      </QueryClientProvider>
    </>
  );
}

export default MyApp;
