import { SignupInputDTO } from '@domains/auth/dto'
import { OffsetPagination } from '@types'
import {ExtendedUserDTO, UserDTO, UserViewDTO} from '../dto'

export interface UserRepository {
  create: (data: SignupInputDTO) => Promise<UserDTO>
  delete: (userId: string) => Promise<void>
  getRecommendedUsersPaginated: (options: OffsetPagination) => Promise<UserDTO[]>
  getById: (userId: string) => Promise<UserDTO | null>
  getByEmailOrUsername: (email?: string, username?: string) => Promise<ExtendedUserDTO | null>
  updateUserPicture: (userId: any, profilePictureUrl: any) => Promise<UserViewDTO | null>
}
