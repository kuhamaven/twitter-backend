import { PrismaClient } from '@prisma/client'
import { ReactionRepository } from './reaction.repository'
import { ExtendedReactionDTO, ReactionDTO } from '@domains/reaction/dto'

export class ReactionRepositoryImpl implements ReactionRepository {
  async reactToPost (reactionDto: ReactionDTO): Promise<ExtendedReactionDTO | null> {
    const existingReaction = await this.db.reaction.findFirst({
      where: {
        postId: reactionDto.postId,
        authorId: reactionDto.authorId,
        reactionType: reactionDto.reactionType
      }
    })

    // If a reaction is found, throw an error
    if (existingReaction) return null

    return await this.db.reaction.create({
      data: {
        postId: reactionDto.postId,
        authorId: reactionDto.authorId,
        reactionType: reactionDto.reactionType
      }
    }).then(reaction => new ExtendedReactionDTO(reaction))
  }

  constructor (private readonly db: PrismaClient) {}
}
