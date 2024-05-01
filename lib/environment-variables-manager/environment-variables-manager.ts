import { KeyValueManager } from 'lib/key-value-manager/key-value-manager.abstract';
import { IKeyValueManager, Options } from 'types/key-value-manager';
import { snakeCase } from 'utils/string-manipulations';

export class EnvironmentVariablesManager extends KeyValueManager implements IKeyValueManager {
  private readonly shouldUpdateProcessEnv: boolean;

  constructor(options?: Options) {
    const dataFileName = process.env.SECRET_NAME!;
    super('EnvironmentVariablesManager', dataFileName, '/secrets');
    this.shouldUpdateProcessEnv = Boolean(options?.updateProcessEnv);
    this.initData();
  }

  protected initData() {
    super.initData();

    if (this.shouldUpdateProcessEnv) {
      Object.entries(this.cachedData!).forEach(([key, value]) => {
        const snakeCaseKey = snakeCase(key, { upperCase: true });
        process.env[snakeCaseKey] = value as string;
      });
    }

    this.logger.info(`[${this.tag}] Successfully updated process.env with data from file`, { mondayInternal: true });
  }
}
