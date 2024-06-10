import { FollowerRepository } from '../repository'
import { FollowerService } from '.'
import {ExtendFollowDTO, FollowDTO} from '@domains/follower/dto'

export class FollowerServiceImpl implements FollowerService {
  constructor (private readonly repository: FollowerRepository) {}

  async follow (userId: string, followedId: string): Promise<ExtendFollowDTO> {
    const followDto = new FollowDTO(userId, followedId)
    return await this.repository.follow(followDto)
  }

  async unfollow (userId: string, followedId: string): Promise<void> {
    const followDto = new FollowDTO(userId, followedId)
    await this.repository.unfollow(followDto)
  }
}
