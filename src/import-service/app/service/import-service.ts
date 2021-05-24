import { S3 } from 'aws-sdk';
import csvParser from 'csv-parser';
import { QueueService } from "./queue-service";

const BUCKET_NAME = 'products-s3-csv';
const UPD_FILES_DIR = 'uploaded';
const PARSED_FILES_DIR = 'parsed';

export class ImportService {
  s3Client: S3;
  queueService: QueueService;

  constructor(s3Client: S3, queueService: QueueService) {
    this.s3Client = s3Client;
    this.queueService = queueService;
  }

  async parse(filename: string): Promise<void> {
    this.parseCsv(filename)
      .then(() =>
        this.s3Client
        .copyObject({
          Bucket: BUCKET_NAME,
          CopySource: `${BUCKET_NAME}/${UPD_FILES_DIR}/${filename}`,
          Key: `${PARSED_FILES_DIR}/${filename}`,
        })
        .promise()
        .then(() => {
          this.s3Client
            .deleteObject({
              Bucket: BUCKET_NAME,
              Key: `${UPD_FILES_DIR}/${filename}`,
            })
            .promise();
        }))
      .catch(err => console.log(`Error occurred: ${err}`))
  }

  private parseCsv(filename: string): Promise<void> {
    return new Promise<void>((res) => {
      this.s3Client
        .getObject({
          Bucket: BUCKET_NAME,
          Key: `${UPD_FILES_DIR}/${filename}`,
        })
        .createReadStream()
        .pipe(csvParser())
        .on('data', (data) => {
          console.log(`Parsing data: ${data}`);
          this.queueService.publishMessage(data);
        })
        .on('end', () => {
          console.error('Data was parsed');
          res()
        })
        .on('error', (error) => {
          console.error(`Error occurred: ${error}`);
        });
    })
      .catch(err => console.log(`Error occurred: ${err}`));
  }
}
