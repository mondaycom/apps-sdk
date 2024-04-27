import { IQueue } from '../types/queue';
export declare class QueueDev implements IQueue {
    constructor();
    publishMessage(message: (Uint8Array | string), options?: {
        topicName: string;
    }): Promise<string>;
    validateMessageSecret(secret: string): boolean;
}
