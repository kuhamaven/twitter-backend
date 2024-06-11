import { ExtendedReactionDTO } from '@domains/reaction/dto'
import { ReactionType } from '@prisma/client'

export interface ReactionService {
  reactToPost: (postId: any) => Promise<ExtendedReactionDTO | null>
  getReactionsByAuthor: (userId: any, authorId: string, reactionType: ReactionType) => Promise<ExtendedReactionDTO[]>
}
