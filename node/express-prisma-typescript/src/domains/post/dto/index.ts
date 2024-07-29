import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { UserViewDTO } from '@domains/user/dto'
import { ExtendedReactionDTO } from '@domains/reaction/dto'
import {User} from "@prisma/client";

export class CreatePostInputDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(240)
    content!: string

  @IsOptional()
  @MaxLength(4)
    images?: string[]
}

export class PostDTO {
  constructor (post: PostDTO) {
    this.id = post.id
    this.authorId = post.authorId
    this.content = post.content
    this.images = post.images
    this.createdAt = post.createdAt
    this.parentId = post.parentId
  }

  id: string
  authorId: string
  content: string
  images: string[]
  createdAt: Date
  parentId: string | null
}

export class ExtendedPostDTO extends PostDTO {
  constructor (post: ExtendedPostDTO, user: User) {
    super(post)
    this.author = new UserViewDTO(user)
    this.qtyComments = post.qtyComments
    this.qtyLikes = post.qtyLikes
    this.qtyRetweets = post.qtyRetweets
    this.reactions = post.reactions
  }

  author!: UserViewDTO
  qtyComments!: number
  qtyLikes!: number
  qtyRetweets!: number
  reactions: ExtendedReactionDTO[]
}
