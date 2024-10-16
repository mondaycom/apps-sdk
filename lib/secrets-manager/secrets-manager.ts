import { KeyValueManager } from 'lib/key-value-manager/key-value-manager.abstract';
import { IKeyValueManager } from 'types/key-value-manager';

export class SecretsManager extends KeyValueManager implements IKeyValueManager {
  constructor() {
    const dataFileName = process.env.SECRET_NAME!;
    super('SecretsManager', dataFileName, '/secrets-v2');
    this.initData();
  }

}
