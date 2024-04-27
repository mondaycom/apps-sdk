import { BaseStorage } from '../storage/base-storage';
import { JsonValue } from '../types/general';
import { CounterOptions, GetResponse, IStorageInstance, Options, Period } from '../types/storage';
export declare class Storage extends BaseStorage implements IStorageInstance {
    incrementCounter(period: Period, options?: CounterOptions): Promise<{
        error: string | undefined;
        success: boolean;
        message?: undefined;
        newCounterValue?: undefined;
    } | {
        message: string;
        newCounterValue: number;
        success: boolean;
        error?: undefined;
    }>;
    delete(key: string, options?: Options): Promise<{
        error: string;
        success: boolean;
    } | {
        success: boolean;
        error?: undefined;
    }>;
    get<T extends JsonValue>(key: string, options?: Options): Promise<GetResponse<T>>;
    set(key: string, value: any, options?: Options): Promise<{
        version: string;
        success: boolean;
        error?: undefined;
    } | {
        error: string;
        success: boolean;
        version?: undefined;
    }>;
}
