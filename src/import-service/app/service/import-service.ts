import { S3 } from 'aws-sdk';
import csvParser from 'csv-parser';

const BUCKET_NAME = 'products-s3-csv';
const UPD_FILES_DIR = 'uploaded';
const PARSED_FILES_DIR = 'parsed';

export class ImportService {
  s3Client: S3;

  constructor(s3Client: S3) {
    this.s3Client = s3Client;
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
  }

  private parseCsv(filename: string): Promise<void> {
    const resultSet = [];
    return new Promise<void>((res) => {
      this.s3Client
        .getObject({
          Bucket: BUCKET_NAME,
          Key: `${UPD_FILES_DIR}/${filename}`,
        })
        .createReadStream()
        .pipe(csvParser())
        .on('data', (data) => {
          console.log(`Parsing data: ${data}`)
          resultSet.push(data)
        })
        .on('end', () => res())
        .on('error', (error) => {
          console.error(`Error occurred: ${error}`);
        });
    });
  }
}
