import { JsonValue } from '../types/general';
import { GetOptions, IKeyValueManager, Options } from '../types/environment-variables-manager';
export declare class EnvironmentVariablesManager implements IKeyValueManager {
    private cachedEnvironmentData?;
    private shouldUpdateProcessEnv;
    constructor(options?: Options);
    private initEnvIfNeeded;
    private initEnv;
    getKeys(options?: GetOptions): Array<string>;
    get(key: string, options?: GetOptions): JsonValue;
}
