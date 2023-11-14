import fetch from 'node-fetch';

import { BadRequestError } from 'errors/apps-sdk-error';
import { IQueue } from 'types/queue';
import { localServerAddress } from 'utils/env';

const devQueueSecret = '376a573e97497a294fd50e584fa3e507d1eab65abd2019709c0e8dc6b1893212'
const devGenerateMessageId = () => {
    let messageId = '';
    while (messageId.length < 16) {
        messageId += Math.floor(Math.random() * (9 - 1 + 1) + 1).toString()
    }
    return messageId;
}

export class QueueDev implements IQueue {
    constructor() {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/require-await
    async publishMessage(message: (Uint8Array|string), options?: { topicName: string }): Promise<string> {
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
    }

    validateMessageSecret(secret: string) : boolean {
        if (!secret) {
            throw new BadRequestError('secret is required.');
        }

        return (secret === devQueueSecret)
    }
}
