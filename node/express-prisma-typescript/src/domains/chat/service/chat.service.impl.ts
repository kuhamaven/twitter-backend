import { ChatRepository } from '../repository'
import { ChatService } from '.'

export class ChatServiceImpl implements ChatService {
  constructor (private readonly repository: ChatRepository) {
  }

  async create (userId: string, otherId: string): Promise<null> {
    return await Promise.resolve(null)
  }
}
