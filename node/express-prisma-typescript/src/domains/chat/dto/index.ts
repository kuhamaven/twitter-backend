import { DateTime } from 'aws-sdk/clients/ec2'
import { Conversation, Message } from '@prisma/client'

export class ConversationDTO {
  constructor (conversation: Conversation, members: string[]) {
    this.id = conversation.id
    this.createdAt = conversation.createdAt
    this.members = members
  }

  id: string
  createdAt: DateTime
  members: string[]
}

export class MessageDTO {
  constructor (message: Message) {
    this.id = message.id
    this.createdAt = message.createdAt
    this.author = message.authorId
    this.content = message.content
    this.conversation = message.conversationId
  }

  id: string
  createdAt: DateTime
  author: string
  conversation: string
  content: string
}
