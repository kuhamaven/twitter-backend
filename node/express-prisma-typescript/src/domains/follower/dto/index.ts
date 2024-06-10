export class FollowDTO {
  constructor (userId: string, followedId: string) {
    this.followerId = userId
    this.followedId = followedId
  }

  followerId: string
  followedId: string
}

export class ExtendFollowDTO {
  constructor (userId: string, followedId: string, id: string) {
    this.followerId = userId
    this.followedId = followedId
    this.id = id
  }

  followerId: string
  followedId: string
  id: string
}
