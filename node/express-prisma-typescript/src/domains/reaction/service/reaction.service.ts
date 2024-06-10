import { ExtendedReactionDTO } from '@domains/reaction/dto'

export interface ReactionService {
  reactToPost: (postId: any) => Promise<ExtendedReactionDTO | null>
}
