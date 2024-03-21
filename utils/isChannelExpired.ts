import { type StatusResponse } from '@/integrations'

type DepositChannelExpiryOptions = {
  status: StatusResponse
}

type DepositChannelExpiryResponse = {
  isExpired: boolean
  secondsUntilExpiry: number | null
}

export default function isChannelExpired({
  status,
}: DepositChannelExpiryOptions): DepositChannelExpiryResponse {
  const result: DepositChannelExpiryResponse = {
    isExpired: false,
    secondsUntilExpiry: null,
  }
  if (
    status.integration === 'chainflip' &&
    status.integrationData?.estimatedDepositChannelExpiryTime
  ) {
    const expiryTime =
      status.integrationData.estimatedDepositChannelExpiryTime - 3600 * 1000 // We forcefully set 1 hour buffer time for expiration
    if (expiryTime) {
      result.secondsUntilExpiry = Math.max((expiryTime - Date.now()) / 1000)
      result.isExpired =
        process.env.NEXT_PUBLIC_IS_E2E === '1'
          ? status.integrationData.isDepositChannelExpired
          : result.secondsUntilExpiry <= 0
    }
  }

  return result
}
