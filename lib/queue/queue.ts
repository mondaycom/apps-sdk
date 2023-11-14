import { PubSub } from '@google-cloud/pubsub';
import fetch from 'node-fetch';

import {BadRequestError, InternalServerError} from 'errors/apps-sdk-error';
import { IQueue } from 'types/queue';
import {isLocalEnvironment, localServerAddress} from 'utils/env';
import { Logger } from 'utils/logger';

const logger = new Logger('Queue', { mondayInternal: true });
const devQueueSecret = '376a573e97497a294fd50e584fa3e507d1eab65abd2019709c0e8dc6b18932fc'
const devQueueTopic = 'localQueue'
const devGenerateMessageId = () => {
    let messageId = '';
    while (messageId.length < 16) {
        messageId += Math.floor(Math.random() * (9 - 1 + 1) + 1).toString()
    }
    return messageId;
}

export class Queue implements IQueue {
    private pubSubClient: PubSub;
    constructor() {
        this.pubSubClient = new PubSub();
    }

    async publishMessage(message: (Uint8Array|string), options?: { topicName: string }): Promise<string> {
        const topicName = options?.topicName || process.env.MNDY_TOPIC_NAME || isLocalEnvironment() ? devQueueTopic : '';
        if (!topicName) {
            throw new BadRequestError('topicName is missing or empty.');
        }

        try {
            if (isLocalEnvironment()) {
                const payload = (message.toString) ? message.toString() : message;
                const serverAddress = localServerAddress();
                // eslint-disable-next-line @typescript-eslint/no-floating-promises
                fetch(`${serverAddress}/mndy-queue?secret=${devQueueSecret}`, {
                    'headers': {
                        'content-type': 'application/json',
                    },
                    'body': payload,
                    'method': 'POST'
                });
                return devGenerateMessageId();
            } else {
                const data = (typeof message === 'string' || message instanceof String) ? Buffer.from(message) : message;
                const messageId = await this.pubSubClient
                    .topic(topicName)
                    .publishMessage({data, attributes: {'Content-Type': 'application/json'}});
                return messageId;
            }
        } catch (err) {
            logger.error(JSON.stringify(err));
            throw new InternalServerError('An error occurred while sending message toe queue.')
        }
    }

    validateMessageOrigin(secret: string) : boolean {
        const envMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET || isLocalEnvironment() ? devQueueSecret : '';
        if (!envMessageSecret) {
            throw new BadRequestError('En environment variable name "MNDY_SERVER_ADDRESS" is required.');
        }
        if (!secret) {
            throw new BadRequestError('secret is required.');
        }
        const topicMessageSecret = process.env.MNDY_TOPIC_MESSAGES_SECRET;
        if (secret !== topicMessageSecret) {
            return false;
        }
        return true;
    }
}
