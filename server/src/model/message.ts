import { MessageType } from './messageType';
import { User } from './user';

export interface Message {
    from: User | string,
    messageType: MessageType,
    content?: string;
}