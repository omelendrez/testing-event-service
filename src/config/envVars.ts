import dotenv from 'dotenv'
dotenv.config()

const accessKeyId: string = process.env.AWS_ACCESS_KEY_ID || ''
const secretAccessKey: string = process.env.AWS_SECRET_ACCESS_KEY || ''
const queueName: string = process.env.INCOMING_QUEUE_NAME || ''

export { accessKeyId, secretAccessKey, queueName }
