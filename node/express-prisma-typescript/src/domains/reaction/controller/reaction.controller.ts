import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { BodyValidation, db } from '@utils'

import { ReactionRepositoryImpl } from '../repository'
import { ReactionService, ReactionServiceImpl } from '../service'
import { ReactionDTO, ReactionTypeDTO } from '@domains/reaction/dto'

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
