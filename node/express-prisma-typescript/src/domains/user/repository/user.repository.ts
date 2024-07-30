import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import {ExtendedUserDTO, FullUserViewWithPosts, UserDTO, UserViewDTO} from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserViewDTO[]>
  getById: (userId: string) => Promise<[UserViewDTO, boolean] | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  updateUserPicture: (userId: any, profilePictureUrl: any) => Promise<UserViewDTO | null>
  getByUsername: (username: any, options: OffsetPagination) => Promise<UserViewDTO[] | null>
  getFullUser: (userId: string, withPosts: boolean) => Promise<FullUserViewWithPosts | null>
}
