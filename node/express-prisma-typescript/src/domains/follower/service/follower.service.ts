import {ExtendFollowDTO, FollowDTO} from '@domains/follower/dto'

export interface FollowerService {
  follow: (userId: string, followedId: string) => Promise<ExtendFollowDTO>
  unfollow: (userId: string, followedId: string) => Promise<void>
}
