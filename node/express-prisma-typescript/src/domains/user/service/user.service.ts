import { OffsetPagination } from '@types'
import {UserDTO, UserViewDTO} from '../dto'

export interface UserService {
  deleteUser: (userId: any) => Promise<void>
  getUser: (userId: any) => Promise<UserDTO>
  getUserRecommendations: (userId: any, options: OffsetPagination) => Promise<UserDTO[]>
  updateUserPicture: (userId: any, profilePictureUrl: any) => Promise<UserViewDTO>
}
