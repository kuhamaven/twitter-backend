import { OffsetPagination } from '@types'
import { FullUserView, FullUserViewWithPosts, UserViewDTO } from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<[FullUserView, boolean]>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  updateUserPicture: (userId: any, profilePictureUrl: any) => Promise<UserViewDTO>
  getByUsername: (username: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  getMe: (userId: string) => Promise<FullUserViewWithPosts>
}
