import { Post, PrismaClient, Reaction, ReactionType, User } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async comment (userId: string, postId: string, data: CreatePostInputDTO): Promise<PostDTO | null> {
    const parent = await this.getById(userId, postId)
    if (!parent) return null
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        parentId: parent.id,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (userId: string, includeComments: boolean, options: CursorPagination): Promise<ExtendedPostDTO[]> {
    let whereCondition: any = {
      OR: [
        {
          author: {
            isPrivate: false
          }
        },
        {
          author: {
            isPrivate: true,
            followers: {
              some: {
                followerId: userId
              }
            }
          }
        },
        {
          author: {
            isPrivate: true,
            id: userId
          }
        }
      ]
    }

    // Conditionally add filter for parentId based on includeComments
    if (!includeComments) {
      whereCondition = {
        ...whereCondition,
        parentId: null // Filter out posts with non-null parentId
      }
    }

    const posts = await this.db.post.findMany({
      where: whereCondition,
      include: {
        author: true,
        comments: true,
        reactions: true
      },
      cursor: options.after ? { id: options.after } : (options.before) ? { id: options.before } : undefined,
      skip: options.after ?? options.before ? 1 : undefined,
      take: options.limit ? (options.before ? -options.limit : options.limit) : undefined,
      orderBy: [
        {
          createdAt: 'desc'
        },
        {
          id: 'asc'
        }
      ]
    })

    const extendedPosts = await this.getExtendedPostDto(posts)

    return extendedPosts ?? []
  }

  async delete (postId: string): Promise<void> {
    await this.db.post.delete({
      where: {
        id: postId
      }
    })
  }

  async getById (userId: string, postId: string): Promise<PostDTO | null> {
    const post = await this.db.post.findUnique({
      where: {
        id: postId
      },
      include: {
        author: {
          include: {
            followers: true
          }
        }
      }
    })

    // If the post is not found, return null
    if (!post) return null

    // Check if the post is public or if the user follows the author
    const canUserSeePost = !post.author.isPrivate || post.author.followers.some(follower => follower.followerId === userId)

    // Otherwise, return the post wrapped in PostDTO
    return canUserSeePost ? new PostDTO(post) : null
  }

  async getByAuthorId (userId: string, comments: boolean, authorId: string): Promise<ExtendedPostDTO[] | null> {
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

    const posts = await this.db.post.findMany({
      where: {
        authorId,
        parentId: comments ? { not: null } : null
      },
      include: {
        author: true,
        comments: true,
        reactions: true
      }
    })

    return await this.getExtendedPostDto(posts)
  }

  async getByParentId (userId: string, postId: string, options: CursorPagination): Promise<ExtendedPostDTO[] | null> {
    const { limit, before, after } = options

    const whereCondition: any = {
      OR: [
        {
          author: {
            isPrivate: false
          }
        },
        {
          author: {
            isPrivate: true,
            followers: {
              some: {
                followerId: userId
              }
            }
          }
        },
        {
          author: {
            isPrivate: true,
            id: userId
          }
        }
      ],
      parentId: postId
    }

    const cursor = after ? { id: after } : before ? { id: before } : undefined
    const skip = after ?? before ? 1 : undefined
    const take = limit ? (before ? -limit : limit) : undefined

    const posts = await this.db.post.findMany({
      where: whereCondition,
      include: {
        author: true,
        reactions: true,
        comments: true
      },
      cursor,
      skip,
      take,
      orderBy: [
        {
          reactions: {
            _count: 'desc'
          }
        },
        {
          id: 'asc'
        }
      ]
    })

    return await this.getExtendedPostDto(posts)
  }

  async getExtendedPostDto (posts: Array<Post & { author: User, comments: Post[], reactions: Reaction[] }>): Promise<ExtendedPostDTO[] | null> {
    const postsWithReactionCount = await Promise.all(posts.map(async (post) => {
      const qtyComments = post.comments.length
      const qtyLikes = post.reactions.filter(reaction => reaction.reactionType === ReactionType.Like).length
      const qtyRetweets = post.reactions.filter(reaction => reaction.reactionType === ReactionType.Retweet).length
      const totalReactions = post.reactions.length

      return {
        ...post,
        qtyComments,
        qtyLikes,
        qtyRetweets,
        totalReactions
      }
    }))

    return postsWithReactionCount.map(post => new ExtendedPostDTO(post))
  }
}
