import AWS from 'aws-sdk'
import crypto from 'crypto'
require('dotenv').config()

const url = process.env.AWS_ENDPOINT

if (!url) {
  throw Error('Missing AWS endpoint')
}

const config = {
  endpoint: new AWS.Endpoint(url),
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-1',
  apiVersion: '2012-11-05'
}

const sqs = new AWS.SQS(config)

const name = process.env.INCOMING_QUEUE_NAME

if (!name) {
  throw Error('Missing queue name')
}

console.log(name)

const messageGroupId = crypto.randomUUID()

sqs.createQueue(
  {
    QueueName: name,
    Attributes: {
      FifoQueue: 'true'
    }
  },
  async (err: any, data: any) => {
    if (err) {
      console.error(err)
      return
    }
    const queueUrl = data.QueueUrl

    const messageBody = {
      userId: 'UBgRDFxrT4Ovg4DtwJTzOQ',
      isHost: true,
      isAppOpen: true
    }

    for (let i = 0; i < 1; i++) {
      console.log(`Sending message #${i + 1}`)
      sqs.sendMessage(
        {
          MessageBody: JSON.stringify(messageBody),
          MessageDeduplicationId: crypto.randomUUID(),
          MessageGroupId: messageGroupId,

          MessageAttributes: {
            eventName: { StringValue: 'userJoinedMeeting', DataType: 'String' }
          },
          QueueUrl: queueUrl!
        },
        (err, data) => {
          if (err) {
            console.log('SendMessage callback: err, data:', err, data)
          }
        }
      )
    }
  }
)
