import { db } from '@/services/database'
import { provider } from '@/services/provider'
import { GetQuoteResponse } from '@/types/get-quote.response'
import { formatTicker } from '@/utils/format-ticker'
import { formatHistory } from '@/utils/fortmat-history'
import { SQSHandler } from 'aws-lambda'
import { AxiosResponse } from 'axios'

export const handler: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const sqsMessage = JSON.parse(record.body)
      const tickerId = sqsMessage.tickerId

      console.log(`SQS_IMPORTER: ${tickerId}`)

      const response: AxiosResponse<GetQuoteResponse> = await provider.get(
        `/quote/${tickerId}?range=3mo&interval=1d`,
      )
      const ticker = formatTicker(response.data.results[0])
      const history = formatHistory(
        ticker.symbol,
        response.data.results[0].historicalDataPrice,
      )

      await db('quote').insert(ticker)
      for (const item of history) {
        await db('history').insert(item)
      }
    }
  } catch (error) {
    console.log(error)
  }
}
