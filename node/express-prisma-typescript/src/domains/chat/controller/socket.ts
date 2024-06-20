import { Server } from 'socket.io'
import { db } from '@utils'
import { ChatService, ChatServiceImpl } from '@domains/chat/service'
import { ChatRepositoryImpl } from '@domains/chat/repository'

export const setupSocketHandlers = (io: Server): void => {
  const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

  io.on('connection', async (socket) => {
    io.socketsJoin(socket.id)
    const { userId } = socket.data.context
    const conversations = await service.getAllConversationsIds(userId)
    conversations.forEach(conversation => { io.socketsJoin(conversation) })

    socket.on('disconnect', () => {
      io.socketsLeave(socket.id)
      conversations.forEach(conversation => { io.socketsLeave(conversation) })
    })

    socket.on('createConversation', async (data: { users: string[] }): Promise<any> => {
      const { users } = data
      try {
        const { userId } = socket.data.context
        const conversationDto = await service.create(userId, users)
        io.socketsJoin(conversationDto.id)
      } catch (error) {
        io.to(socket.id).emit('error', error)
      }
    })

    socket.on('sendMessage', async (data: { conversationId: string, message: string }): Promise<void> => {
      const { conversationId, message } = data
      try {
        const { userId } = socket.data.context
        const messageDto = await service.sendMessage(userId, conversationId, message)

        io.to(conversationId).emit('receiveMessage', messageDto)
      } catch (error) {
        console.log(error)
        io.to(socket.id).emit('error', error)
      }
    })
  })
}
