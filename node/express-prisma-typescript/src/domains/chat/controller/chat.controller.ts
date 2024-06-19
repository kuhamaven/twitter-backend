import { Server } from 'socket.io'
import { db } from '@utils'
import { ChatService, ChatServiceImpl } from '@domains/chat/service'
import { ChatRepositoryImpl } from '@domains/chat/repository'

export const setupSocketHandlers = (io: Server): void => {
  const service: ChatService = new ChatServiceImpl(new ChatRepositoryImpl(db))

  io.on('connection', async (socket) => {
    console.log('a user connected')
    io.socketsJoin(socket.id)
    const { userId } = socket.data.context
    const conversations = await service.getAllConversationsIds(userId)
    conversations.forEach(conversation => { io.socketsJoin(conversation) })

    socket.on('disconnect', () => {
      console.log('user disconnected')
      io.socketsLeave(socket.id)
      conversations.forEach(conversation => { io.socketsLeave(conversation) })
    })

    socket.on('createConversation', async (data: string): Promise<any> => {
      const users: string[] = JSON.parse(data)
      try {
        const { userId } = socket.data.context
        const convo = await service.create(userId, users)
        io.socketsJoin(convo.id)
      } catch (error) {
        console.error('Error creating conversation:', error)
      }
    })

    socket.on('sendMessage', async (data: string): Promise<void> => {
      const { conversationId, message } = JSON.parse(data)
      try {
        const { userId } = socket.data.context
        const messageDto = await service.sendMessage(userId, conversationId, message)

        io.to(conversationId).emit('receiveMessage', messageDto)
      } catch (error) {
        console.error('Error sending message:', error)
      }
    })

    socket.on('receiveMessage', (messageDto: any) => {
      console.log('Received message:', messageDto)
    })
  })
}
