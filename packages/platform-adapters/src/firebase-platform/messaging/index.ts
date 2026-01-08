import {
  getMessaging,
  Message,
  MulticastMessage,
  SendResponse,
  BatchResponse,
} from 'firebase-admin/messaging';
import { getFirebaseAdminApp } from '../app/firebase.app';

const messaging = () => getMessaging(getFirebaseAdminApp());

export const sendMessage = (message: Message): Promise<string> => messaging().send(message);

export const sendMulticast = (message: MulticastMessage): Promise<BatchResponse> =>
  messaging().sendEachForMulticast(message);

export const sendToTopic = (
  topic: string,
  data: Message['data'],
  options: Omit<Message, 'token' | 'topic' | 'data'> = {},
): Promise<string> => messaging().send({ ...options, topic, data });

/**
 * Convenience helper: publish data to the conventional events-{module} topic.
 */
export const sendModuleEvent = (
  module: string,
  data: Record<string, string>,
  options: Omit<Message, 'token' | 'topic' | 'data'> = {},
): Promise<string> => sendToTopic(`events-${module}`, data, options);
