import AWS from "aws-sdk";
import crypto from 'crypto';
require('dotenv').config();

const url = process.env.AWS_ENDPOINT;

if (!url) {
  throw Error('Missing AWS endpoint');
}

const config = {
  endpoint: new AWS.Endpoint(url),
  accessKeyId: 'na',
  secretAccessKey: 'na',
  region: 'REGION'
};

const sqs = new AWS.SQS(config);

const name = process.env.INCOMING_QUEUE_NAME;

if (!name) {
  throw Error('Missing queue name');
}

const messageGroupId = crypto.randomUUID();

sqs.createQueue({
  QueueName: name,
  Attributes: {
    FifoQueue: "true"
  }
}, async (err: any, data: any) => {
  if (err) {
    console.error(err);
    return;
  }
  const queueUrl = data.QueueUrl;

  for (let i = 0; i < 10; i++) {
    const messageBody = {
      userId: 'UBgRDFxrT4Ovg4DtwJTzOQ',
      isHost: true,
      isAppOpen: true
    };

    console.log(`Sending message #${i + 1}`);
    sqs.sendMessage({
      MessageBody: JSON.stringify(messageBody),
      MessageDeduplicationId: crypto.randomUUID(),
      MessageGroupId: messageGroupId,

      MessageAttributes: {
        eventName: { StringValue: 'userJoinedMeeting', DataType: 'String' }
      },
      QueueUrl: queueUrl!,
    }, (err, data) => {
      if (err) {
        console.log("SendMessage callback: err, data:", err, data);
      }
    });
  }

});

