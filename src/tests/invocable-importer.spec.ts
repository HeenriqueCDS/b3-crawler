import { handler } from '@/functions/invocable-importer'
import { db } from '@/services/database'
import { Callback, Context, SQSEvent } from 'aws-lambda'

let context: Context
let callback: Callback

const eventMock = {
  messageId: '1',
  receiptHandle: '2',
  awsRegion: 'us-east-1',
  eventSource: 'aws:sqs',
  eventSourceARN: 'arn:aws:sqs:us-east-1:123456789012:my-queue',
  md5OfBody: '7b270e59b47ff90a553787216d55d91d',
  messageAttributes: {},
  attributes: {
    ApproximateReceiveCount: '1',
    SentTimestamp: '1545082649183',
    SenderId: '123456789012',
    ApproximateFirstReceiveTimestamp: '1545082649185',
  },
}

describe('invokable-importer', () => {
  afterAll(async () => {
    await db('history').delete()
    await db('quote').delete()
    await db.destroy()
  })

  it('should be able to import ticker and history', async () => {
    const event: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({ tickerId: 'PETR4' }),
          ...eventMock,
        },
      ],
    }

    await handler(event, context, callback)

    const quote = await db('quote').where('symbol', 'PETR4').first()
    expect(quote).toHaveProperty('symbol', 'PETR4')

    const history = await db('history').where('quoteSymbol', 'PETR4')
    expect(history).toHaveLength(62)
  })

  it('should throw an error if ticker is not found', async () => {
    const event: SQSEvent = {
      Records: [
        {
          body: JSON.stringify({ tickerId: 'TICKER ZOADOOOOOOO' }),
          ...eventMock,
        },
      ],
    }
    expect(async () => {
      await handler(event, context, callback)
    }).rejects.toThrow()
  })
})
