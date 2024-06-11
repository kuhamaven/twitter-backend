import {PrismaClient, ReactionType} from '@prisma/client'
import { ReactionRepository } from './reaction.repository'
import { ExtendedReactionDTO, ReactionDTO } from '@domains/reaction/dto'
import {PostDTO} from "@domains/post/dto";

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

  async getReactionsByAuthor (userId: any, authorId: string, reactionType: ReactionType): Promise<ExtendedReactionDTO[] | null> {
    // We check for the user instead of the follow, as we need to see if it's private as well as if it's followed or not
    const author = await this.db.user.findUnique({
      where: {
        id: authorId
      },
      include: {
        followers: true
      }
    })

    if (!author) return null

    // Due to how logical operators are handled, if author isn't private, it won't bother with the second half
    const canUserSeePost = !author.isPrivate || author.followers.some(follower => follower.followerId === userId)
    if (!canUserSeePost) return null

    const reactions = await this.db.reaction.findMany({
      where: {
        authorId,
        reactionType
      }
    })

    return reactions.map(reaction => new ExtendedReactionDTO(reaction))
  }
}
