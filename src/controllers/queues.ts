import { ListQueuesCommand } from '@aws-sdk/client-sqs'
import { client } from '../config/client'

export const listQueues = async (): Promise<string[]> => {
  const command = new ListQueuesCommand({})

  const response = await client.send(command)
  return response.QueueUrls || []
}

export const createQueue = async (queueName: string) => {
  console.log(queueName)
}
