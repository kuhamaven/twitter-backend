export interface ChatService {
  create: (userId: string, otherId: string) => Promise<null>
}
