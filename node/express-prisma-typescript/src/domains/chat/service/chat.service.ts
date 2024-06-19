import { ConversationDTO, MessageDTO } from '@domains/chat/dto'

export interface ChatService {
  create: (userId: string, users: string[]) => Promise<ConversationDTO>
  sendMessage: (userId: string, conversationId: string, message: string) => Promise<MessageDTO>
  getAllConversationsIds: (userId: string) => Promise<string[]>
}
