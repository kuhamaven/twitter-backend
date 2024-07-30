import { NotFoundException } from '@utils/errors'
import { OffsetPagination } from 'types'
import {FullUserView, FullUserViewWithPosts, UserViewDTO} from '../dto'
import { UserRepository } from '../repository'
import { UserService } from './user.service'

export class UserServiceImpl implements UserService {
  constructor (private readonly repository: UserRepository) {}

  async getUser (userId: any): Promise<[FullUserView, boolean]> {
    const user = await this.repository.getFullUser(userId, false)
    if (!user) throw new NotFoundException('user')
    const follows = user.following.some(f => f.id === userId) !== undefined
    return [user, follows]
  }

  async getMe (userId: string): Promise<FullUserViewWithPosts> {
    const user = await this.repository.getFullUser(userId, true)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getUserRecommendations (userId: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    // TODO: make this return only users followed by users the original user follows
    return await this.repository.getRecommendedUsersPaginated(options)
  }

  async deleteUser (userId: any): Promise<void> {
    await this.repository.delete(userId)
  }

  async updateUserPicture (userId: any, profilePictureUrl: any): Promise<UserViewDTO> {
    const user = await this.repository.updateUserPicture(userId, profilePictureUrl)
    if (!user) throw new NotFoundException('user')
    return user
  }

  async getByUsername (username: any, options: OffsetPagination): Promise<UserViewDTO[]> {
    const users = await this.repository.getByUsername(username, options)
    return users ?? []
  }
}
