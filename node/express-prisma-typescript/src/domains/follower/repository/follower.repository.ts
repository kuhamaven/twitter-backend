import {ExtendFollowDTO, FollowDTO} from '@domains/follower/dto'

export interface FollowerRepository {
  follow: (followDto: FollowDTO) => Promise<ExtendFollowDTO>
  unfollow: (followDto: FollowDTO) => Promise<void>
}
