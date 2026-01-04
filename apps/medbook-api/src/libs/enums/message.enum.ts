import { registerEnumType } from '@nestjs/graphql';

export enum MessageType {
  TEXT = 'TEXT',
  FILE = 'FILE',
  IMAGE = 'IMAGE',
}

registerEnumType(MessageType, {
  name: 'MessageType',
  description: 'Type of chat message',
});