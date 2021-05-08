import { EventType } from '../model/dto/event-type';
import { S3 } from 'aws-sdk';

const BUCKET_NAME = 'products-s3-csv';
const UPD_FILES_DIR = 'uploaded';

export class ResourceAccessService {
  s3Client: S3;
  constructor(s3Client: S3) {
    this.s3Client = s3Client;
  }

  public getSignedUrl(eventType: EventType, fileName: string): Promise<string> {
    const params = {
      Bucket: BUCKET_NAME,
      Key: `${UPD_FILES_DIR}/${fileName}`,
      Expires: 100,
      ContentType: 'text/csv',
    };

    const s3Operation: string = eventType === EventType.GET ? 'getObject' : 'putObject';

    return this.s3Client.getSignedUrlPromise(s3Operation, params);
  }
}
