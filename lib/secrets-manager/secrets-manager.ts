import { KeyValueManager } from 'lib/key-value-manager/key-value-manager.abstract';

// TODO: bump version (consider open PRs that also bump version)
// TODO: create new release on github - with notes on env-vars not being secured anymore

export class SecretsManager extends KeyValueManager {
  constructor() {
    const dataFileName = process.env.SECRET_NAME!; // TODO this should change for secrets (both file and folder name)
    super('SecretsManager', dataFileName, 'secrets');
    this.initData();
  }

}
