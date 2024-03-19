import { type Token } from '@/shared/assets/tokens'

type TokenPricesQueryData = {
  tokenPrices: {
    address: string
    chainId: string
    usdPrice: number
  }[]
}
const tokePricesQuery = `
query GetTokenPrices($tokens: [PriceQueryInput!]!) {
  tokenPrices: getTokenPrices(input: $tokens) {
    chainId
    address
    usdPrice
    }
}`

export const fetchTokenPrices = async (tokens: Token[]) => {
  if (tokens.length === 0) {
    return Promise.resolve([])
  }
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_STATECHAIN_CACHE_GRAPHQL_API as string,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          query: tokePricesQuery,
          variables: {
            tokens: tokens.map((token) => ({
              chainId: token.chain.id,
              address: token.address,
            })),
          },
        }),
      }
    )
    const data = await response.json()

    if (!data.data || typeof data.data !== 'object') {
      // eslint-disable-next-line no-console
      console.error('Unexpected response when fetching token prices', data)
      return []
    }
    return (data.data as TokenPricesQueryData).tokenPrices
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Unexpected error when fetching token prices', err)
    return []
  }
}
