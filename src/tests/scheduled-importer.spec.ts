import { handler } from '@/functions/scheduled-importer'
import { db } from '@/services/database'
import { listQuotes } from '@/utils/client/list-quotes'
import { Callback, Context, EventBridgeEvent } from 'aws-lambda'

let event: EventBridgeEvent<'Scheduled Event', string>
let context: Context
let callback: Callback

describe('scheduled-importer', () => {
  afterAll(async () => {
    await db('history').delete()
    await db('quote').delete()
    await db.destroy()
  })

  it('should be able to import tickers and history', async () => {
    await handler(event, context, callback)
    const quotes = await db('quote')
      .select('symbol')
      .limit(10)
      .orderBy('regularMarketVolume', 'desc')
      .then((data) => data.map((item) => item.symbol))

    const symbols = await listQuotes(1)
    expect(quotes.sort()).toEqual(symbols.sort())
    const history = await db('history').count('date', { as: 'count' }).first()
    expect(history).toEqual({ count: '620' })
  })

  it('should be able to import tickers from the second page', async () => {
    await handler(event, context, callback)
    const quotes = await db('quote')
      .select('symbol')
      .limit(10)
      .offset(10)
      .orderBy('regularMarketVolume', 'desc')
      .then((data) => data.map((item) => item.symbol))

    const symbols = await listQuotes(2)
    expect(quotes.sort()).toEqual(symbols.sort())
  })
}, 30000)
