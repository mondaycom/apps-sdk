import { PubSub } from '@google-cloud/pubsub';

import {BadRequestError, InternalServerError} from 'errors/apps-sdk-error';
import { IQueue } from 'types/queue';
import { Logger } from 'utils/logger';

const logger = new Logger('Queue', { mondayInternal: true });

export class Queue implements IQueue {
    private pubSubClient: PubSub;
    constructor() {
        this.pubSubClient = new PubSub();
    }

    async publishMessage(message: (Uint8Array|string|null), options?: { topicName: string }): Promise<string> {
        const topicName =  options?.topicName || process.env.MNDY_TOPIC_NAME;
        if (!topicName) {
            throw new BadRequestError('topicName is missing or empty.');
        }

        try {

            const messageId = await this.pubSubClient
                .topic(topicName)
                .publishMessage({data: message, attributes: {'Content-Type': 'application/json'}});
            return messageId;

        } catch (err) {
            logger.error(JSON.stringify(err));
            throw new InternalServerError('An error occurred while sending message toe queue.')
        }
    }
}
