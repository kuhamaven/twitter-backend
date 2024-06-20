import { ConversationDTO, MessageDTO } from '@domains/chat/dto'

export interface ChatRepository {
  create: (userId: string, users: string[]) => Promise<ConversationDTO | null>
  sendMessage: (userId: string, conversationId: string, message: string) => Promise<MessageDTO | null>
  getAllConversationsIds: (userId: string) => Promise<string[]>
  getAllConversations: (userId: string) => Promise<ConversationDTO[]>
  getAllMessages: (userId: string, conversationId: string) => Promise<MessageDTO[]>
}
