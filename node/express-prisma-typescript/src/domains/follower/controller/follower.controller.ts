import { Request, Response, Router } from 'express'
import HttpStatus from 'http-status'
// express-async-errors is a module that handles async errors in express, don't forget import it in your new controllers
import 'express-async-errors'

import { db } from '@utils'

import { FollowerRepositoryImpl } from '../repository'
import { FollowerService, FollowerServiceImpl } from '../service'

export const followerRouter = Router()

// Use dependency injection
const service: FollowerService = new FollowerServiceImpl(new FollowerRepositoryImpl(db))

followerRouter.post('/follow/:user_id', async (req: Request, res: Response) => {
  const { followerId } = res.locals.context
  const followedId = req.params.user_id;

  await service.follow(followerId, followedId)

  return res.status(HttpStatus.OK)
})

followerRouter.post('/unfollow/:user_id', async (req: Request, res: Response) => {
  const { followerId } = res.locals.context
  const followedId = req.params.user_id;

  await service.unfollow(followerId, followedId)

  return res.status(HttpStatus.OK)
})
