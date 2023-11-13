
export type IQueue = {
  publishMessage: (message: (Uint8Array|string|null), options?: { topicName: string }) => Promise<string>
}
