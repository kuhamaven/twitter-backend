import { ExtendedReactionDTO } from '@domains/reaction/dto'

export interface ReactionRepository {
  reactToPost: (postId: any) => Promise<ExtendedReactionDTO | null>
}
