import { SQSClient } from '@aws-sdk/client-sqs'
import { accessKeyId, secretAccessKey } from './envVars'

export const client = new SQSClient({
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  region: 'us-east-1',
  apiVersion: '2012-11-05'
})
