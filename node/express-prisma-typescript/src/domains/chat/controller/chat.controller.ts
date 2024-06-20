import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { ChatRepositoryImpl } from '../repository'
import { ChatService, ChatServiceImpl } from '../service'

export const chatRouter = Router()

// Use dependency injection
const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

/**
 * @swagger
 * /api/chat/:
 *   get:
 *     summary: Get all conversations for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/ConversationDTO'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Unauthorized"
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
chatRouter.get('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  const conversations = await service.getAllConversations(userId)

  return res.status(HttpStatus.OK).json(conversations)
})

/**
 * @swagger
 * /api/chat/{conversationId}:
 *   get:
 *     summary: Get all messages in a conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversationId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to retrieve messages from
 *     responses:
 *       200:
 *         description: Messages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MessageDTO'
 *       401:
 *         description: Unauthorized - user does not belong to the conversation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Unauthorized"
 *       404:
 *         description: Not Found - conversation does not exist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *               example:
 *                 message: "Conversation not found"
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
chatRouter.get('/:conversationId', async (req: Request, res: Response) => {
  const { userId } = res.locals.context
  const { conversationId } = req.params

  const messages = await service.getAllMessages(userId, conversationId)

  return res.status(HttpStatus.OK).json(messages)
})
