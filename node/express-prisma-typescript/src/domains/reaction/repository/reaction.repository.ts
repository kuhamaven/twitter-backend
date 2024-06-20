import { ExtendedReactionDTO } from '@domains/reaction/dto'
import { ReactionType } from '@prisma/client'

export interface ReactionRepository {
  reactToPost: (postId: any) => Promise<ExtendedReactionDTO | null>
  deleteReactToPost: (postId: any) => Promise<ExtendedReactionDTO | null>
  getReactionsByAuthor: (userId: any, authorId: string, reactionType: ReactionType) => Promise<ExtendedReactionDTO[] | null>
}
