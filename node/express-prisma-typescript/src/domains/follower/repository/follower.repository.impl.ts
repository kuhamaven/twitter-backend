import { PrismaClient } from '@prisma/client'

import { FollowerRepository } from '.'
import { FollowDTO } from '@domains/follower/dto'

export class FollowerRepositoryImpl implements FollowerRepository {
  constructor (private readonly db: PrismaClient) {}

  async follow (followDto: FollowDTO): Promise<void> {
    // Find the user that is trying to follow
    const user = await this.db.user.findUnique({
      where: {
        id: followDto.followerId
      },
      include: {
        follows: true // Include the Follow records related to this user
      }
    })

    // Check if the user was found
    if (!user) {
      throw new Error('User not found')
    }

    // If the specific follow doesn't exist already, create it
    if (!user.follows.find(follow => follow.followedId === followDto.followedId)) {
      await this.db.follow.create({
        data: {
          ...followDto
        }
      })
    }
  }

  async unfollow (followDto: FollowDTO): Promise<void> {
    // Find the user that is trying to unfollow
    const user = await this.db.user.findUnique({
      where: {
        id: followDto.followerId
      },
      include: {
        follows: true // Include the Follow records related to this user
      }
    })

    // Check if the user was found
    if (!user) {
      throw new Error('User not found')
    }

    // Check if the user has any follows
    if (!user.follows.length) {
      throw new Error('No follows')
    }

    // Find the specific Follow record where FollowedId matches the provided ID
    const followToDelete = user.follows.find(follow => follow.followedId === followDto.followedId)

    if (!followToDelete) {
      throw new Error('Follow record not found')
    }

    // Delete the found Follow record
    await this.db.follow.delete({
      where: {
        id: followToDelete.id
      }
    })
  }
}
