import { Reaction, ReactionType } from '@prisma/client'
import { IsNotEmpty } from 'class-validator'

export class ReactionTypeDTO {
  constructor (reactionType: ReactionType) {
    this.reactionType = reactionType
  }

  @IsNotEmpty()
    reactionType: ReactionType
}

export class ReactionDTO {
  constructor (reactionType: ReactionType, userId: string, postId: string) {
    this.reactionType = reactionType
    this.authorId = userId
    this.postId = postId
  }

  reactionType: ReactionType
  authorId: string
  postId: string
}

export class ExtendedReactionDTO extends ReactionDTO {
  constructor (reaction: Reaction) {
    super(reaction.reactionType, reaction.authorId, reaction.postId)
    this.id = reaction.id
  }

  id: string
}
