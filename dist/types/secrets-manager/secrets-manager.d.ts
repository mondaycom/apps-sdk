import { JsonValue } from '../types/general';
import { GetOptions, IKeyValueManager } from '../types/environment-variables-manager';
export declare class SecretsManager implements IKeyValueManager {
    private cachedSecretsData?;
    constructor();
    private initSecretsIfNeeded;
    private initSecrets;
    getKeys(options?: GetOptions): Array<string>;
    get(key: string, options?: GetOptions): JsonValue;
}
