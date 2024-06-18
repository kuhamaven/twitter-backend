import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { ChatService, ChatServiceImpl } from '../service'
import { ChatRepositoryImpl } from '@domains/chat/repository'

export const postRouter = Router()

// Use dependency injection
const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

postRouter.post('/', async (req: Request, res: Response) => {
  const { userId } = res.locals.context

  // Call the service method with the parsed 'includeComments' value
  const posts = await service.create(userId, 'asdasdsa')

  return res.status(HttpStatus.OK).json(posts)
})
