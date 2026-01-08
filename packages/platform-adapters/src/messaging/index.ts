import { Message, MulticastMessage } from 'firebase-admin/messaging';
import { sendMessage, sendMulticast, sendModuleEvent, sendToTopic } from '../firebase-platform';

export { sendMessage, sendMulticast, sendModuleEvent, sendToTopic };

// Optional type re-exports for consumers
export type { Message, MulticastMessage };
