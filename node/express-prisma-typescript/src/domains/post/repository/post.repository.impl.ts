import { PrismaClient } from '@prisma/client'

import { CursorPagination } from '@types'

import { PostRepository } from '.'
import { CreatePostInputDTO, PostDTO } from '../dto'

export class PostRepositoryImpl implements PostRepository {
  constructor (private readonly db: PrismaClient) {}

  async create (userId: string, data: CreatePostInputDTO): Promise<PostDTO> {
    const post = await this.db.post.create({
      data: {
        authorId: userId,
        ...data
      }
    })
    return new PostDTO(post)
  }

  async getAllByDatePaginated (userId: string, options: CursorPagination): Promise<PostDTO[]> {
    const posts = await this.db.post.findMany({
      where: {
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
      },
      include: {
        author: true
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
    return posts.map(post => new PostDTO(post))
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

  async getByAuthorId (userId: string, authorId: string): Promise<PostDTO[] | null> {
    // We check for the user instead of the follow, as we need to see if its private as well as if its followed or not
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
        authorId
      }
    })
    return posts.map(post => new PostDTO(post))
  }
}
