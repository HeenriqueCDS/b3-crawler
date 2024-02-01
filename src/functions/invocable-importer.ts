import { db } from '@/services/database'
import { pusher } from '@/services/pusher'

import { getCompleteQuote } from '@/utils/client/get-complete-quote'
import { SQSHandler } from 'aws-lambda'

export const handler: SQSHandler = async (event) => {
  for (const record of event.Records) {
    const sqsMessage = JSON.parse(record.body)
    const tickerId = sqsMessage.tickerId
    console.log(`SQS_IMPORTER: ${tickerId}`)
    try {
      const { ticker, history } = await getCompleteQuote(tickerId)
      await db('quote').insert(ticker).onConflict('symbol').merge()
      await db('history')
        .insert(history)
        .onConflict(['quoteSymbol', 'date'])
        .merge()
      pusher.trigger(`${tickerId}-tracker`, 'stock-updated', ticker)
    } catch (error) {
      pusher.trigger(`${tickerId}-tracker`, 'stock-not-found', tickerId)
      console.error(error)
    }
  }
}
