export interface FollowerService {
  follow: (userId: string, followedId: string) => Promise<void>
  unfollow: (userId: string, followedId: string) => Promise<void>
}
