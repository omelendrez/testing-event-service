import {
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand
} from '@aws-sdk/client-sqs'
import { client } from '../config/client'
import { generateMockAlertInfo, abbreviateName } from '../helpers'

export const sendMessage = async (sqsQueueUrl: string) => {
  const { rounder, patient, location, delay } = generateMockAlertInfo()

  const rounderName: string = abbreviateName(rounder.name)
  const patientName: string = abbreviateName(patient.name)

  const command = new SendMessageCommand({
    QueueUrl: sqsQueueUrl,
    MessageAttributes: {
      Rounder: {
        DataType: 'String',
        StringValue: rounderName
      },
      RounderId: {
        DataType: 'String',
        StringValue: rounder.id.toLocaleString()
      },
      Patient: {
        DataType: 'String',
        StringValue: patientName
      },
      PatientId: {
        DataType: 'String',
        StringValue: patient.id.toLocaleString()
      },
      Location: {
        DataType: 'String',
        StringValue: location
      },
      Delay: {
        DataType: 'String',
        StringValue: delay
      }
    },
    MessageBody: `Patient ${patientName} on the ${location} unit has a round overdue by ${delay}. Employee ${rounderName} is the responsible rounder.`,
    MessageDeduplicationId: `${patient.id}-${rounder.id}`,
    MessageGroupId: 'OVERDUE_EMAIL_ALERT'
  })

  const response = await client.send(command)
  return `Message sent ${response.MessageId}`
}

const receiveMessage = (queueUrl: string) =>
  client.send(
    new ReceiveMessageCommand({
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      WaitTimeSeconds: 3,
      VisibilityTimeout: 3
    })
  )

export const readMessages = async (sqsQueueUrl: string) => {
  const { Messages } = await receiveMessage(sqsQueueUrl)
  return Messages?.map((message) => message.Body)
}

export const deleteAllMessages = async (sqsQueueUrl: string) => {
  const { Messages } = await receiveMessage(sqsQueueUrl)

  if (!Messages?.length) {
    return 'Queue is empty!'
  }

  if (Messages?.length === 1) {
    await client.send(
      new DeleteMessageCommand({
        QueueUrl: sqsQueueUrl,
        ReceiptHandle: Messages[0].ReceiptHandle
      })
    )
    return 'Message deleted'
  } else {
    await client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: sqsQueueUrl,
        Entries: Messages?.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle
        }))
      })
    )
    return 'All messages deleted'
  }
}
