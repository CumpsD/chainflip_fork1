import { gql } from '@/shared/graphql/generated';

export const getMarketData = gql(/* GraphQL */ `
  query GetMarketData($asset: ChainflipAsset!, $numberOfDays: Int!) {
    marketData(asset: $asset, numberOfDays: $numberOfDays) {
      candlesticks {
        ... on CandlestickData {
          time
          open
          low
          high
          close
        }
        ... on WhitespaceData {
          time
        }
      }
      volumes {
        ... on HistogramData {
          value
          time
        }
        ... on WhitespaceData {
          time
        }
      }
      prices {
        time
        value
      }
      globalVolume
    }
  }
`);

export const getChainTrackingQuery = gql(/* GraphQL */ `
  query GetChainTrackingQuery {
    allChainTrackings {
      nodes {
        chain
        height
      }
    }
  }
`);
