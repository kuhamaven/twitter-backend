import { AuthService, AuthServiceImpl } from '@domains/auth/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { db } from '@utils'

describe('test signup', () => {
  it('should return 200 OK with JSON response', async () => {
    const service: AuthService = new AuthServiceImpl(new UserRepositoryImpl(db))

    const requestBody = {
      email: 'test@test.com',
      username: 'test123',
      password: 'StrongP@ssw0rd',
      isPrivate: false
    }

    const response = await service.signup(requestBody)

    expect(response.token).not.toBeNull()
  })
})
