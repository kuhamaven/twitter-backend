import { PrismaClient } from '@prisma/client'

import { ChatRepository } from '.'
import { ConversationDTO, MessageDTO } from '@domains/chat/dto'

export class ChatRepositoryImpl implements ChatRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (userId: string, users: string[]): Promise<ConversationDTO | null> {
    // Check if the user can start a conversation
    const canStart = await this.userFollowsEveryone(userId, users)

    if (!canStart) return null

    const allMembers = [...users, userId]

    // Create a new conversation
    const newConversation = await this.db.conversation.create({
      data: {
        members: {
          connect: allMembers.map(memberId => ({ id: memberId }))
        }
      },
      include: {
        members: true
      }
    })

    return new ConversationDTO(newConversation, [...users, userId])
  }

  async sendMessage (userId: string, conversationId: string, messageContent: string): Promise<MessageDTO | null> {
    // Check if the user can send a message to the conversation
    const canSendMessage = await this.canSendMessage(userId, conversationId)

    if (!canSendMessage) return null

    const newMessage = await this.db.message.create({
      data: {
        authorId: userId,
        conversationId,
        content: messageContent
      },
      include: {
        author: true,
        conversation: true
      }
    })

    return new MessageDTO(newMessage)
  }

  // Helper method to check if the user follows all other members
  private async userFollowsEveryone (userId: string, users: string[]): Promise<boolean> {
    const userWithFollows = await this.db.user.findUnique({
      where: { id: userId },
      include: {
        follows: {
          select: {
            followedId: true // Only select the IDs of the followed users
          }
        }
      }
    })

    // If the user does not exist, return false
    if (!userWithFollows) return false

    // Extract the list of followed user IDs
    const followedUserIds = userWithFollows.follows.map(follow => follow.followedId)

    // Check if the user follows all the user IDs in the provided list
    for (const followedId of users) {
      if (!followedUserIds.includes(followedId)) {
        return false // If any user is not followed, return false
      }
    }

    // If all users are followed, return true
    return true
  }

  // Helper method to check if the user can send a message to the conversation (Must belong and follow everyone)
  private async canSendMessage (userId: string, conversationId: string): Promise<boolean> {
    const conversation = await this.db.conversation.findUnique({
      where: { id: conversationId },
      include: { members: true }
    })

    if (!conversation) return false

    const memberIds = conversation.members.map(member => member.id)

    if (!memberIds.includes(userId)) return false

    const filteredMemberIds = memberIds.filter(memberId => memberId !== userId)
    return await this.userFollowsEveryone(userId, filteredMemberIds)
  }
}
