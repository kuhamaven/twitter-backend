import { ReactionService } from './reaction.service'
import { ReactionRepository } from '@domains/reaction/repository'
import { ExtendedReactionDTO, ReactionDTO } from '@domains/reaction/dto'
import { ConflictException, NotFoundException } from '@utils'
import { ReactionType } from '@prisma/client'

export class ReactionServiceImpl implements ReactionService {
  constructor (private readonly repository: ReactionRepository) {}

  async reactToPost (reaction: ReactionDTO): Promise<ExtendedReactionDTO | null> {
    const result = await this.repository.reactToPost(reaction)
    if (result == null) throw new ConflictException('reaction already exists')
    return result
  }

  async getReactionsByAuthor (userId: any, authorId: string, reactionType: ReactionType): Promise<ExtendedReactionDTO[]> {
    const reactions = await this.repository.getReactionsByAuthor(userId, authorId, reactionType)
    if (!reactions) throw new NotFoundException('reactions')
    return reactions
  }
}
