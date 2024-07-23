import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { Constants, db } from '@utils'

import { UserRepositoryImpl } from '../repository'
import { UserService, UserServiceImpl } from '../service'
import { generatePresignedUrl } from '@domains/aws/AwsPreSignedHandler'
import multer from 'multer'
import axios from 'axios'
import { FullUserView } from '@domains/user/dto'

export const userRouter = Router()
const upload = multer() // Initialize multer

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
 *               $ref: '#/components/schemas/UserViewDTO'
 *       500:
 *         description: Internal server error
 */
userRouter.get('/me', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const user = await service.getMe(userId)

  return res.status(HttpStatus.OK).json(new FullUserView(user[0], user[1], user[2], []))
})

/**
 * @swagger
 * /api/user/presigned_url:
 *   get:
 *     summary: Generate a pre-signed URL for file upload
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
userRouter.get('/presigned_url', async (req: Request, res: Response) => {
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

/**
 * @swagger
 * /api/user/profile_picture:
 *   put:
 *     summary: Update user profile picture
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: profilePicture
 *         required: true
 *         schema:
 *           type: string
 *         description: URL of the profile picture to set
 *     responses:
 *       200:
 *         description: Profile picture updated successfully
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Profile picture is required and must be a string"
 *       403:
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Not authorized to update profile picture"
 *       500:
 *         description: Internal server error
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
 *                 message: "Internal server error"
 *                 error: {}
 */
userRouter.put('/profile_picture', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { profilePicture } = req.query

  if (profilePicture == null) {
    return res.status(400).json({ message: 'Profile picture is required and must be a string' })
  }

  return await service.updateUserPicture(userId, profilePicture)
})

/**
 * @swagger
 * /api/user/upload:
 *   post:
 *     summary: Upload a user profile picture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Successfully uploaded the file
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "File uploaded successfully"
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
userRouter.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const file = req.file

  if (!file) {
    return res.status(400).json({ message: 'File is required' })
  }

  try {
    // Generate presigned URL
    const fileExtension = file.mimetype.split('/')[1] // Get the file extension from the MIME type
    const presignedUrl = await generatePresignedUrl(userId, fileExtension)

    // Upload the file to AWS S3 using the presigned URL
    await axios.put(presignedUrl, file.buffer, {
      headers: {
        'Content-Type': file.mimetype
      }
    })

    const url = new URL(presignedUrl)
    const key = url.pathname.substring(1) // Remove leading '/'
    const publicUrl = `https://${Constants.BUCKET_NAME}.s3.${Constants.REGION_NAME}.amazonaws.com/${key}`
    const userViewDto = await service.updateUserPicture(userId, publicUrl)

    res.status(200).json({ userViewDto })
  } catch (error) {
    res.status(500).json({ message: 'Could not upload file', error })
  }
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
 *         description: Successfully retrieved the user and followsBack status
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/UserViewDTO'
 *                   followsBack:
 *                     type: boolean
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
 * /api/user/by_username/{username}:
 *   get:
 *     summary: Get users by username search
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema:
 *           type: string
 *         description: Username or part of a username to search for
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Maximum number of users to return
 *       - in: query
 *         name: skip
 *         required: false
 *         schema:
 *           type: integer
 *           example: 0
 *         description: Number of users to skip (pagination)
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedUserDTO'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Bad request"
 *       500:
 *         description: Internal server error
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
 *                 message: "Internal server error"
 *                 error: {}
 */
userRouter.get('/by_username/:username', async (req: Request, res: Response) => {
  const { username } = req.params
  const { limit, skip } = req.query as Record<string, string>

  const user = await service.getByUsername(username, { limit: Number(limit), skip: Number(skip) })

  return res.status(HttpStatus.OK).json(user)
})
