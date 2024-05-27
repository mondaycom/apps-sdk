import { PubSub } from '@google-cloud/pubsub';
import { Compute, GoogleAuth } from 'google-auth-library';
import { JSONClient } from 'google-auth-library/build/src/auth/googleauth';

import {BadRequestError, InternalServerError} from 'errors/apps-sdk-error';
import { IQueue } from 'types/queue';
import { Logger } from 'utils/logger';

const logger = new Logger('Queue', { mondayInternal: true });

export class QueueProd implements IQueue {
    private pubSubClient: PubSub;
    constructor() {
            const computeClient = new Compute();
                const auth = new GoogleAuth({authClient: computeClient}) as unknown as GoogleAuth<JSONClient>;
                this.pubSubClient = new PubSub({auth});   
    }

    async publishMessage(message: (Uint8Array|string), options?: { topicName: string }): Promise<string> {
        const topicName = options?.topicName || process.env.MNDY_TOPIC_NAME;
        if (!topicName) {
            throw new BadRequestError('topicName is missing or empty.');
        }

        try {
            const data = (typeof message === 'string') ? Buffer.from(message) : message;
            const messageId = await this.pubSubClient
                .topic(topicName)
                .publishMessage({data, attributes: {'Content-Type': 'application/json'}});
            return messageId;
        } catch (err) {
            logger.error(JSON.stringify(err));
            throw new InternalServerError('An error occurred while sending message toe queue.')
        }
    }

    validateMessageSecret(secret: string) : boolean {
        const envMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET;
        if (!envMessageSecret) {
            throw new BadRequestError('En environment variable name "MNDY_TOPIC_MESSAGES_SECRET" is required.');
        }
        if (!secret) {
            throw new BadRequestError('secret is required.');
        }
        const topicMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET;
        return secret === topicMessageSecret;
    }
}
