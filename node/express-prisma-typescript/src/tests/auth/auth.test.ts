import { describe } from '@jest/globals'
import { AuthServiceImpl } from '@domains/auth/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users } from '../data'

describe('Auth User', () => {
  const prisma = jestPrisma.client
  const userRepository = new UserRepositoryImpl(prisma)
  const authService = new AuthServiceImpl(userRepository)

  test('Sign up user successfully should return token and register it', async () => {
    const user = users[0]
    const token = await authService.signup(user)

    expect(token.token).not.toBeNull()
    expect(typeof token.token).toBe('string')
    expect(token.token).not.toBe('')

    const createdUser = await userRepository.getByUsername(user.username, { limit: Number(1), skip: Number(0) })
    expect(createdUser).not.toBeNull()
    if (createdUser) {
      expect(createdUser[0].username).toEqual(user.username)
    }
  })
})
