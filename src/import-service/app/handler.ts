
import { Handler } from 'aws-lambda';
import { S3, SNS, SQS } from 'aws-sdk';

import { ImportController } from './controller/import-controller';
import { ImportService } from './service/import-service';
import { ResourceAccessService } from './service/resource-access-service';
import { NotificationService } from './service/notification-service';
import { QueueService } from './service/queue-service';

const s3Client: S3 = new S3({ region: 'us-east-1' });
const snsClient: SNS = new SNS({ region: 'us-east-1' });
const sqsClient: SQS = new SQS({ region: 'us-east-1' });
const queueService = new QueueService(sqsClient, process.env.BATCH_QUEUE_ARN);
const importService = new ImportService(s3Client, queueService);
const resourceAccessService = new ResourceAccessService(s3Client);
const notificationService = new NotificationService(snsClient, process.env.BATCH_TOPIC_ARN);
const importController = new ImportController(resourceAccessService, importService, notificationService);

export const importProductsFile: Handler = (event: any) => importController.importProductsFile(event);

export const importFileParser: Handler = (event: any) => importController.importFileParser(event);

export const catalogBatchProcess: Handler = (event: any) => importController.catalogBatchProcess(event);
