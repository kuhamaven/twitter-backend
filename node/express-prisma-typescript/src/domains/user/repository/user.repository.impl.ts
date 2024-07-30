import { SignupInputDTO } from '@domains/auth/dto'
import { PrismaClient, User } from '@prisma/client'
import { OffsetPagination } from '@types'
import {ExtendedUserDTO, FullUserView, FullUserViewWithPosts, UserDTO, UserViewDTO} from '../dto'
import { UserRepository } from './user.repository'
import {posts} from "@tests/data";

export class UserRepositoryImpl implements UserRepository {
  constructor (private readonly db: PrismaClient) {
  }

  async create (data: SignupInputDTO): Promise<UserDTO> {
    return await this.db.user.create({
      data
    }).then(user => new UserDTO(user))
  }

  async getById (userId: any): Promise<[UserViewDTO, boolean] | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        follows: true
      }
    })

    if (!user) return null

    const followsUser = user.follows.some(follow => follow.followerId === userId)

    return [new UserViewDTO(user), followsUser]
  }

  async getFullUser (userId: string, withPosts: boolean): Promise<FullUserViewWithPosts | null> {
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      },
      include: {
        follows: true,
        followers: true,
        posts: withPosts
      }
    })

    if (!user) return null

    const following = await Promise.all(user.follows.map(async (follow) => {
      const followedUser = await this.db.user.findUnique({
        where: {
          id: follow.followedId
        }
      })

      if (followedUser) {
        return new UserViewDTO(followedUser)
      }
      return null
    }))

    const followers = await Promise.all(user.followers.map(async (follow) => {
      const followerUser = await this.db.user.findUnique({
        where: {
          id: follow.followerId
        }
      })

      if (followerUser) {
        return new UserViewDTO(followerUser)
      }
      return null
    }))

    const filteredFollowing = following.filter(followedUser => followedUser !== null) as UserViewDTO[]
    const filteredFollowers = followers.filter(followedUser => followedUser !== null) as UserViewDTO[]

    return new FullUserViewWithPosts(user, filteredFollowing, filteredFollowers, withPosts ? user.posts : [])
  }

  async delete (userId: any): Promise<void> {
    await this.db.user.delete({
      where: {
        id: userId
      }
    })
  }

  async getRecommendedUsersPaginated (options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.db.user.findMany({
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined,
      orderBy: [
        {
          id: 'asc'
        }
      ]
    })
    return users.map(user => new UserViewDTO(user))
  }

  async getByEmailOrUsername (email?: string, username?: string): Promise<ExtendedUserDTO | null> {
    let whereCondition: any = {}

    if (username === null || username === undefined) {
      if (email?.match('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')) {
        whereCondition = {
          email
        }
      } else {
        whereCondition = {
          username: email
        }
      }
    } else {
      whereCondition = {
        OR: [
          {
            email
          },
          {
            username
          }
        ]
      }
    }

    const user = await this.db.user.findFirst({
      where: whereCondition
    })
    return user ? new ExtendedUserDTO(user) : null
  }

  async updateUserPicture (userId: string, profilePictureUrl: string): Promise<UserViewDTO | null> {
    // Find the user
    const user = await this.db.user.findUnique({
      where: {
        id: userId
      }
    })

    // If the user is not found, return null
    if (!user) return null

    // Update the user's profile picture
    const updatedUser = await this.db.user.update({
      where: {
        id: userId
      },
      data: {
        profilePicture: profilePictureUrl
      }
    })

    // Return the updated user as a UserDTO
    return new UserViewDTO(updatedUser)
  }

  async getByUsername (username: any, options: OffsetPagination): Promise<UserViewDTO[] | null> {
    const users = await this.db.user.findMany({
      where: {
        username: {
          contains: username
        }
      },
      orderBy: [
        {
          id: 'asc'
        }
      ],
      take: options.limit ? options.limit : undefined,
      skip: options.skip ? options.skip : undefined
    })

    return users.map(user => (user))
  }
}
