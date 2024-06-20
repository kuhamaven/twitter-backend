import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation, db } from '@utils'

import { ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'
import { ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'
import { ReactionType } from '@prisma/client'

export const reactionRouter = Router()

// Use dependency injection
const service: ReactionService = new ReactionServiceImpl(new ReactionRepositoryImpl(db))

/**
 * @swagger
 * /api/reaction/{post_id}:
 *   post:
 *     summary: React to a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post to react to
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ReactionTypeDTO'
 *     responses:
 *       200:
 *         description: Reaction saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtendedReactionDTO'
 *       400:
 *         description: Bad request
 *       409:
 *         description: Reaction already exists
 *       500:
 *         description: Internal server error
 */
reactionRouter.post('/:post_id', BodyValidation(ReactionTypeDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body
  const postId = req.params.post_id

  const reaction = await service.reactToPost(new ReactionDTO(data.reactionType, userId, postId))

  return res.status(HttpStatus.OK).json(reaction)
})

/**
 * @swagger
 * /api/reaction/by_user/{userId}:
 *   get:
 *     summary: Get reactions by user
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to retrieve reactions from
 *       - in: query
 *         name: reactionType
 *         schema:
 *           type: string
 *         description: Type of reaction to filter by. Defaults to "Like" if not provided.
 *     responses:
 *       200:
 *         description: Successfully retrieved reactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ExtendedReactionDTO'
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
reactionRouter.get('/by_user/:userId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { userId: authorId } = req.params
  const { reactionType } = req.query

  let validReactionType: ReactionType

  if (!(reactionType === null || reactionType === undefined) && typeof reactionType === 'string' && Object.values(ReactionType).includes(reactionType as ReactionType)) {
    validReactionType = reactionType as ReactionType
  } else {
    validReactionType = ReactionType.Like
  }

  const reactions = await service.getReactionsByAuthor(userId, authorId, validReactionType)

  return res.status(HttpStatus.OK).json(reactions)
})

/**
 * @swagger
 * /api/reaction/{post_id}:
 *   delete:
 *     summary: Delete reaction to a post
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: post_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the post from which to delete the reaction
 *       - in: body
 *         required: true
 *         description: Reaction type object
 *         schema:
 *           $ref: '#/components/schemas/ReactionTypeDTO'
 *     responses:
 *       200:
 *         description: Reaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ExtendedReactionDTO'
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
 *                 message: "Not authorized to delete this reaction"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Reaction not found"
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
reactionRouter.delete('/:post_id', BodyValidation(ReactionTypeDTO), async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const data = req.body
  const postId = req.params.post_id

  const reaction = await service.reactToPost(new ReactionDTO(data.reactionType, userId, postId))

  return res.status(HttpStatus.OK).json(reaction)
})
