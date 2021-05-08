
import { Handler } from 'aws-lambda';
import { S3 } from 'aws-sdk';

import { ImportController } from './controller/import-controller';
import { ImportService } from './service/import-service';
import { ResourceAccessService } from './service/resource-access-service';

const s3Client: S3 = new S3({ region: 'us-east-1' });
const importService = new ImportService(s3Client);
const resourceAccessService = new ResourceAccessService(s3Client);
const importController = new ImportController(resourceAccessService, importService);

export const importProductsFile: Handler = (event: any) => importController.importProductsFile(event);

export const importFileParser: Handler = (event: any) => importController.importFileParser(event);
