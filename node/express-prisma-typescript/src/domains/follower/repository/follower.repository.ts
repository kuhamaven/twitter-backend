import { FollowDTO } from '@domains/follower/dto'

export interface FollowerRepository {
  follow: (followDto: FollowDTO) => Promise<void>
  unfollow: (followDto: FollowDTO) => Promise<void>
}
