import { KeyValueManager } from 'lib/key-value-manager/key-value-manager.abstract';

// TODO: bump version (consider open PRs that also bump version)
// TODO: create new release on github -  with notes on env-vars not being secured anymore

export class SecretsManager extends KeyValueManager {
  constructor() {
    const dataFileName = process.env.SECRET_NAME!;
    super('SecretsManager', dataFileName, '/secrets-v2');
    this.initData();
  }

}
