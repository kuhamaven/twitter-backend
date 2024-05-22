export class FollowDTO {
  constructor (userId: string, followedId: string) {
    this.followerId = userId
    this.followedId = followedId
  }

  followerId: string
  followedId: string
}
