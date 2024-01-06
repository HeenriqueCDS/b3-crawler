import { Handler, SQSEvent } from 'aws-lambda'

export const handler: Handler = (event: SQSEvent) => {
  event.Records.forEach((record) => {
    const { body } = record
    console.log(body)
  })
}
