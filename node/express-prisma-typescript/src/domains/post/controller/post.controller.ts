import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db, BodyValidation } from '@utils'

import { PostRepositoryImpl } from '../repository'
import { PostService, PostServiceImpl } from '../service'
import { CreatePostInputDTO } from '../dto'

export const postRouter = Router()

// Use dependency injection
const service: PostService = new PostServiceImpl(new PostRepositoryImpl(db))

/**
 * @swagger
 * /api/post:
 *   get:
 *     summary: Get latest posts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of posts
 *       - in: query
 *         name: before
 *         schema:
 *           type: string
 *         description: Get posts before this date
 *       - in: query
 *         name: after
 *         schema:
 *           type: string
 *         description: Get posts after this date
 *       - in: query
 *         name: withComments
 *         schema:
 *           type: boolean
 *         description: Include comments in the retrieved posts
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       500:
 *         description: Internal server error
 */
postRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { withComments } = req.query
  const { limit, before, after } = req.query as Record<string, string>

  // Parse the 'withComments' query parameter to a boolean
  const includeComments = withComments === 'true'

  // Call the service method with the parsed 'includeComments' value
  const posts = await service.getLatestPosts(userId, { limit: Number(limit), before, after }, includeComments)

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/post/{postId}:
 *   get:
 *     summary: Get a post by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtendedPostDTO'
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
postRouter.get('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  const post = await service.getPost(userId, postId)

  return res.status(HttpStatus.OK).json(post)
})

/**
 * @swagger
 * /api/post/by_user/{userId}:
 *   get:
 *     summary: Get posts by user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve posts from
 *     responses:
 *       200:
 *         description: Successfully retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedPostDTO'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
postRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params

  const posts = await service.getPostsByAuthor(userId, authorId)

  return res.status(HttpStatus.OK).json(posts)
})

/**
 * @swagger
 * /api/post:
 *   post:
 *     summary: Create a new post
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     responses:
 *       201:
 *         description: Successfully created the post
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
postRouter.post('/', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body

  const post = await service.createPost(userId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

/**
 * @swagger
 * /api/post/comment/{postId}:
 *   post:
 *     summary: Comment on a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreatePostInputDTO'
 *     responses:
 *       201:
 *         description: Successfully created the comment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostDTO'
 *       400:
 *         description: Bad request
 *       404:
 *         description: Post not found or User can't comment on that post
 *       500:
 *         description: Internal server error
 */
postRouter.post('/comment/:postId', BodyValidation(CreatePostInputDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body
  const { postId } = req.params

  const post = await service.commentPost(userId, postId, data)

  return res.status(HttpStatus.CREATED).json(post)
})

/**
 * @swagger
 * /api/post/{postId}:
 *   delete:
 *     summary: Delete a post by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to delete
 *     responses:
 *       200:
 *         description: Successfully deleted the post
 *       404:
 *         description: Post not found
 *       500:
 *         description: Internal server error
 */
postRouter.delete('/:postId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { postId } = req.params

  await service.deletePost(userId, postId)

  return res.status(HttpStatus.OK).send(`Deleted post ${postId}`)
})
