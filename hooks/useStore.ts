import type {} from '@redux-devtools/extension' // required for devtools typing
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { validateChainAddress } from '@/shared/assets/chains/addressValidation'
import { type Token } from '@/shared/assets/tokens'
import { chainflipAssetMap, type TokenAmount } from '@/shared/utils'
import type { RouteResponse } from '../integrations'

interface Store {
  srcToken: Token | undefined
  srcAmount: TokenAmount | undefined
  destToken: Token | undefined
  destinationAddress: string
  selectedRoute: RouteResponse | undefined
  setSrcToken: (srcToken: Token | undefined) => void
  setSrcAmount: (srcAmount: TokenAmount | undefined) => void
  setDestToken: (destToken: Token | undefined) => void
  setDestinationAddress: (destinationAddress: string) => void
  setSelectedRoute: (selectedRoute: RouteResponse | undefined) => void
  reset: () => void
}

const initialData = {
  srcToken: chainflipAssetMap.Btc,
  srcAmount: undefined,
  destToken: chainflipAssetMap.Eth,
  destinationAddress: '',
  selectedRoute: undefined,
}

const useStore = create<Store>()(
  devtools(
    immer((set) => ({
      ...initialData,
      setSrcToken: (srcToken) => set({ srcToken }, false, 'setSrcToken'),
      setSrcAmount: (srcAmount) => set({ srcAmount }, false, 'setSrcAmount'),
      setDestToken: (destToken) => set({ destToken }, false, 'setDestToken'),
      setDestinationAddress: (destinationAddress) =>
        set({ destinationAddress }, false, 'setDestinationAddress'),
      setSelectedRoute: (selectedRoute) =>
        set({ selectedRoute }, false, 'setSelectedRoute'),
      reset: () => set({ ...initialData }, false, 'reset'),
    }))
  )
)

export const selectDestinationAddressValid = (state: Store) => {
  if (state.destinationAddress) {
    return (
      !state.destToken ||
      validateChainAddress(state.destinationAddress)[state.destToken.chain.id]
    )
  }
  return false
}

export const selectShowRouteList = (state: Store) =>
  Boolean(
    state.srcAmount &&
      state.srcToken &&
      state.destToken &&
      state.srcAmount.gt(0)
  )

export default useStore
