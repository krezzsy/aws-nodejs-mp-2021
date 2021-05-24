import { SNS } from 'aws-sdk';

export class NotificationService {
  snsClient: SNS;
  snsTopicArn: string;

  constructor(snsClient: SNS, snsTopicArn: string) {
    this.snsClient = snsClient;
    this.snsTopicArn = snsTopicArn;
  }

  public sendNotification(message: string): void {
    this.snsClient
      .publish({
        Subject: 'Products files has been processed',
        TopicArn: this.snsTopicArn,
        Message: message,
      });
  }
}
