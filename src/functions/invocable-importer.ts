import { db } from '@/services/database'
import { getCompleteQuote } from '@/utils/client/get-complete-quote'
import { SQSHandler } from 'aws-lambda'

export const handler: SQSHandler = async (event) => {
  try {
    for (const record of event.Records) {
      const sqsMessage = JSON.parse(record.body)
      const tickerId = sqsMessage.tickerId

      console.log(`SQS_IMPORTER: ${tickerId}`)

      const { ticker, history } = await getCompleteQuote(tickerId)

      await db('quote').insert(ticker).onConflict('symbol').ignore()
      for (const item of history) {
        await db('history').insert(item).onConflict('date').ignore()
      }
    }
  } catch (error: any) {
    throw new Error(error)
  }
}
