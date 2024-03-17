import axios from 'axios'
import { stringifiedTokenAmountReviver } from '@/shared/utils/TokenAmount'

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_CHAINFLIP_BACKEND_URL,
  timeout: 5000,
  transformResponse: [
    (raw) => {
      try {
        return JSON.parse(raw, stringifiedTokenAmountReviver)
      } catch {
        return raw
      }
    },
  ],
})
