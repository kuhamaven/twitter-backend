import { ChatRepository } from '../repository'
import { ChatService } from '.'
import { ConversationDTO, MessageDTO } from '@domains/chat/dto'
import { UnauthorizedException } from '@utils'

export class ChatServiceImpl implements ChatService {
  constructor (private readonly repository: ChatRepository) {}

  async create (userId: string, users: string[]): Promise<ConversationDTO> {
    const conversation = await this.repository.create(userId, users)
    if (!conversation) throw new UnauthorizedException()
    return conversation
  }

  async sendMessage (userId: string, conversationId: string, message: string): Promise<MessageDTO> {
    const messageDto = await this.repository.sendMessage(userId, conversationId, message)
    if (!messageDto) throw new UnauthorizedException()
    return messageDto
  }

  async getAllConversationsIds (userId: string): Promise<string[]> {
    const conversations = await this.repository.getAllConversationsIds(userId)
    return conversations
  }
}
