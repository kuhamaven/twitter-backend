import { OffsetPagination } from '@types'
import { UserViewDTO } from '../dto'
import { User } from '@prisma/client'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<[UserViewDTO, boolean]>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  updateUserPicture: (userId: any, profilePictureUrl: any) => Promise<UserViewDTO>
  getByUsername: (username: any, options: OffsetPagination) => Promise<UserViewDTO[]>
  getMe: (userId: string) => Promise<[User, UserViewDTO[], UserViewDTO[]]>
}
