
export type IQueue = {
  publishMessage: (topicName: string, message: (Uint8Array|string|null)) => Promise<string>
}
