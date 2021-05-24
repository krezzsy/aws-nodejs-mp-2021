import { SQS } from 'aws-sdk';

export class QueueService {
  sqsClient: SQS;
  sqsArn: string;

  constructor(sqsClient: SQS, sqsArn: string) {
    this.sqsClient = sqsClient;
    this.sqsArn = sqsArn;
  }

  public publishMessage(message: string): void {
    this.sqsClient
      .sendMessage({
        MessageBody: message,
        QueueUrl: this.sqsArn,
      });
  }
}
