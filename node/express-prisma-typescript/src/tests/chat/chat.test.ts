import { describe } from '@jest/globals'
import { AuthServiceImpl } from '@domains/auth/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from '../data'
import { ChatRepositoryImpl } from '@domains/chat/repository'
import { FollowerRepositoryImpl } from '@domains/follower/repository'
import { FollowDTO } from '@domains/follower/dto'

describe('Chat tests', () => {
  const prisma = jestPrisma.client
  const userRepository = new UserRepositoryImpl(prisma)
  const authService = new AuthServiceImpl(userRepository)
  const chatRepository = new ChatRepositoryImpl(prisma)
  const followRepository = new FollowerRepositoryImpl(prisma)

  test('Creating a chat should work if everyone follows everyone', async () => {
    const user = users[0]
    await authService.signup(user)
    const user2 = users[1]
    await authService.signup(user2)

    const createdUser = await userRepository.getByUsername('testUser', { limit: Number(2), skip: Number(0) })

    if (createdUser) {
      const followDto1 = new FollowDTO(createdUser[0].id, createdUser[1].id)
      const followDto2 = new FollowDTO(createdUser[1].id, createdUser[0].id)
      await followRepository.follow(followDto1)
      await followRepository.follow(followDto2)

      const conversation = await chatRepository.create(createdUser[0].id, [createdUser[1].id])
      expect(conversation).not.toBeNull()
      expect(conversation?.members.length).toBe(2)
    }
  })

  test('Creating a chat should not work if everyone does not follow everyone', async () => {
    const user = users[0]
    await authService.signup(user)
    const user2 = users[1]
    await authService.signup(user2)

    const createdUser = await userRepository.getByUsername('testUser', { limit: Number(2), skip: Number(0) })

    if (createdUser) {
      const followDto = new FollowDTO(createdUser[0].id, createdUser[1].id)
      await followRepository.follow(followDto)

      const conversation = await chatRepository.create(createdUser[0].id, [createdUser[1].id])
      expect(conversation).toBeNull()
    }
  })
})
