import { IQueue } from '../types/queue';
export declare class QueueProd implements IQueue {
    private pubSubClient;
    constructor();
    publishMessage(message: (Uint8Array | string), options?: {
        topicName: string;
    }): Promise<string>;
    validateMessageSecret(secret: string): boolean;
}
