import { CursorPagination } from '@types'
import { CreatePostInputDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  comment: (userId: string, postId: string, data: CreatePostInputDTO) => Promise<PostDTO | null>
  getAllByDatePaginated: (userId: string, includeComments: boolean, options: CursorPagination) => Promise<PostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (userId: string, postId: string) => Promise<PostDTO | null>
  getByAuthorId: (userId: string, comments: boolean, authorId: string) => Promise<PostDTO[] | null>
}
