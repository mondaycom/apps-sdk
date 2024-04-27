export type IQueue = {
    publishMessage: (message: (Uint8Array | string), options?: {
        topicName: string;
    }) => Promise<string>;
    validateMessageSecret: (secret: string) => boolean;
};
