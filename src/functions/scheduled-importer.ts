import { db } from '@/services/database'
import { pusher } from '@/services/pusher'
import { getCompleteQuote } from '@/utils/client/get-complete-quote'
import { listQuotes } from '@/utils/client/list-quotes'

import { ScheduledHandler } from 'aws-lambda'

export const handler: ScheduledHandler = async (event) => {
  const count = await db('quote').count('symbol', { as: 'count' }).first()
  const page = Math.ceil(Number(count?.count) / 10) + 1 || 0
  const symbols = await listQuotes(page)
  console.log(`SCHEDULED_IMPORTER: ${symbols}`)
  for (const symbol of symbols) {
    const { ticker, history } = await getCompleteQuote(symbol)
    await db('quote').insert(ticker).onConflict('symbol').merge()
    await db('history')
      .insert(history)
      .onConflict(['quoteSymbol', 'date'])
      .merge()
  }
  await pusher.trigger('stock-update', 'scheduled-event', symbols)
}
