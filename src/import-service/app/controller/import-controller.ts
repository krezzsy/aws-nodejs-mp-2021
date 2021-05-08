import { MessageUtil } from '../utils/message';
import { ResourceAccessService } from "../service/resource-access-service";
import { EventType } from "../model/dto/event-type";
import { ImportService } from "../service/import-service";

export class ImportController {
  resourceAccessService: ResourceAccessService;
  importService: ImportService;

  constructor (resourceAccessService: ResourceAccessService, importService: ImportService) {
    this.resourceAccessService = resourceAccessService;
    this.importService = importService;
  }

  async importProductsFile (event: any) {
    console.log('Incoming event: ', event);

    try {
      const url = await this.resourceAccessService.getSignedUrl(EventType.PUT, event.queryStringParameters.filename);
      return MessageUtil.success({url});
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }

  async importFileParser (event: any) {
    console.log('Incoming event: ', event);
    try {
      // for (const record of event.Records) {
      //   await this.importService.parse(record.s3.object.key);
      // }
      await this.importService.parse('products.csv');
      return MessageUtil.success({});
    } catch (err) {
      console.error(err);
      return MessageUtil.error(err.code, err.message);
    }
  }
}
