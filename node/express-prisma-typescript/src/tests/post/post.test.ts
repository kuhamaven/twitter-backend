import { describe } from '@jest/globals'
import { AuthServiceImpl } from '@domains/auth/service'
import { UserRepositoryImpl } from '@domains/user/repository'
import { users, posts } from '../data'
import { PostRepositoryImpl } from '@domains/post/repository'
import { ReactionRepositoryImpl } from '@domains/reaction/repository'
import { ReactionDTO } from '@domains/reaction/dto'
import { ReactionType } from '@prisma/client'

describe('Post tests', () => {
  const prisma = jestPrisma.client
  const userRepository = new UserRepositoryImpl(prisma)
  const authService = new AuthServiceImpl(userRepository)
  const postRepository = new PostRepositoryImpl(prisma)
  const reactionRepository = new ReactionRepositoryImpl(prisma)

  test('Creating a post should persist it', async () => {
    const user = users[0]
    await authService.signup(user)
    const createdUser = await userRepository.getByUsername(user.username, { limit: Number(1), skip: Number(0) })
    if (createdUser) {
      const id = createdUser[0].id
      const post = await postRepository.create(id, posts[0])

      expect(post).not.toBeNull()
      expect(post.id).not.toBeNull()
      expect(post.content).toBe(posts[0].content)
    }
  })

  test('Commenting a post should persist the comment as a post', async () => {
    const user = users[0]
    await authService.signup(user)
    const createdUser = await userRepository.getByUsername(user.username, { limit: Number(1), skip: Number(0) })
    if (createdUser) {
      const id = createdUser[0].id
      const post = await postRepository.create(id, posts[0])

      const comment = await postRepository.comment(id, post.id, posts[1])

      expect(comment).not.toBeNull()
      expect(comment?.id).not.toBeNull()
      expect(comment?.content).toBe(posts[1].content)
    }
  })

  test('Reacting to a post should persist the reaction', async () => {
    const user = users[0]
    await authService.signup(user)
    const createdUser = await userRepository.getByUsername(user.username, { limit: Number(1), skip: Number(0) })
    if (createdUser) {
      const id = createdUser[0].id
      const post = await postRepository.create(id, posts[0])

      const reactionDto = new ReactionDTO(ReactionType.Like, id, post.id)
      const reaction = await reactionRepository.reactToPost(reactionDto)

      expect(reaction).not.toBeNull()
      expect(reaction?.id).not.toBeNull()
      expect(reaction?.reactionType).toBe(ReactionType.Like)
    }
  })
})
