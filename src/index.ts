import readline from 'readline'
import { queueName } from './config/envVars'
import { listQueues, createQueue } from './controllers/queues'
import {
  deleteAllMessages,
  readMessages,
  sendMessage
} from './controllers/messages'

let queueURL: string

if (process.stdin.isTTY) {
  process.stdin.setRawMode(true)
}

process.stdin.on('keypress', (_, key) => {
  switch (key.name) {
    case 's':
      sendMessage(queueURL)
        .then((resp) => {
          console.log(resp)
          console.log()
        })
        .catch((error) => console.error(error))
      break

    case 'r':
      readMessages(queueURL)
        .then((data) => {
          data?.length
            ? data?.forEach((resp: any) => console.log(resp))
            : console.log('Queue is empty!')
          console.log(`${data?.length || 0} messages`)
          console.log()
        })
        .catch((error) => console.error(error))

      break

    case 'd':
      deleteAllMessages(queueURL)
        .then((resp) => {
          console.log(resp)
          console.log()
        })
        .catch((error) => console.error(error))

      break

    case 'q':
      console.log('Exiting...')
      process.exit(0)
  }
})

listQueues()
  .then((queues) => {
    const queueExists = queues.find((q: string) => q.includes(queueName))

    if (!queueExists) {
      createQueue(queueName)
    } else {
      queueURL = queueExists
      console.log('-'.repeat(100))
      console.log(`Queue ${queueName} exists!`)
      console.log('-'.repeat(100))

      console.log(`Press 's' key to send a message to the queue in AWS cloud`)
      console.log(`Press 'r' key to read messages from the queue in AWS cloud`)
      console.log(
        `Press 'd' key to delete all messages from the queue in AWS cloud`
      )
      console.log('-'.repeat(100))
      console.log(`Press 'q' to exit the app`)
      console.log()
    }
  })
  .catch((error: any) => {
    console.error(error)
    process.exit(0)
  })

readline.emitKeypressEvents(process.stdin)
