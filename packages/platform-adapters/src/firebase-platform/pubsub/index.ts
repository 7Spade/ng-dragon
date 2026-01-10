import { PubSub, Topic } from '@google-cloud/pubsub';

// Pub/Sub client uses ADC by default; no extra env wiring required.
const pubSubClient = new PubSub();

const getTopic = (name: string): Topic => pubSubClient.topic(name);

// Type alias based on publishMessage input to avoid coupling to internal types.
type TopicMessage = Parameters<Topic['publishMessage']>[0];

export const moduleTopicName = (module: string) => `events-${module}`;

export const publishModuleEvent = async (module: string, message: TopicMessage): Promise<string> => {
  const topic = getTopic(moduleTopicName(module));
  const [messageId] = await topic.publishMessage(message);
  return messageId;
};

export const publishJsonEvent = async (
  module: string,
  json: Record<string, unknown>,
  attributes?: Record<string, string>
): Promise<string> =>
  publishModuleEvent(module, {
    data: Buffer.from(JSON.stringify(json)),
    attributes
  });
