import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { generatePresignedUrl } from '@domains/aws/AwsPreSignedHandler'

export const userRouter = Router()

// Use dependency injection
const service: UserService = new UserServiceImpl(new UserRepositoryImpl(db))

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Get user recommendations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Limit the number of users
 *       - in: query
 *         name: skip
 *         schema:
 *           type: integer
 *         description: Skip a number of users
 *     responses:
 *       200:
 *         description: Successfully retrieved user recommendations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserViewDTO'
 *       500:
 *         description: Internal server error
 */
userRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { limit, skip } = req.query as Record<string, string>

  const users = await service.getUserRecommendations(userId, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(users)
})

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved current user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtendedUserDTO'
 *       500:
 *         description: Internal server error
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getUser(userId)

  return res.status(HttpStatus.OK).json(user)
})

/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Get a user by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve
 *     responses:
 *       200:
 *         description: Successfully retrieved the user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtendedUserDTO'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
userRouter.get('/:userId', async (req: Request, res: Response) => {
  const { userId: otherUserId } = req.params

  const user = await service.getUser(otherUserId)

  return res.status(HttpStatus.OK).json(user)
})

/**
 * @swagger
 * /api/user:
 *   delete:
 *     summary: Delete current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully deleted the user
 *       500:
 *         description: Internal server error
 */
userRouter.delete('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  await service.deleteUser(userId)

  return res.status(HttpStatus.OK)
})

/**
 * @swagger
 * /user/{userId}/presigned-url:
 *   get:
 *     summary: Generate a pre-signed URL for file upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user
 *       - in: query
 *         name: fileType
 *         required: true
 *         schema:
 *           type: string
 *         description: Type of the file to be uploaded
 *     responses:
 *       200:
 *         description: Pre-signed URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 *                   description: The pre-signed URL
 *               example:
 *                 url: "https://example.com/presigned-url"
 *       400:
 *         description: Bad request, file type is required and must be a string
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "File type is required and must be a string"
 *       500:
 *         description: Could not generate pre-signed URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 error:
 *                   type: object
 *               example:
 *                 message: "Could not generate pre-signed URL"
 *                 error: {}
 */
userRouter.get('/:userId/presigned-url', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { fileType } = req.query

  if (typeof fileType !== 'string') {
    return res.status(400).json({ message: 'File type is required and must be a string' })
  }

  try {
    const url = await generatePresignedUrl(userId, fileType)
    res.json({ url })
  } catch (error) {
    res.status(500).json({ message: 'Could not generate pre-signed URL', error })
  }
})
