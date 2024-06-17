import { CursorPagination } from '@types'
import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostRepository {
  create: (userId: string, data: CreatePostInputDTO) => Promise<PostDTO>
  comment: (userId: string, postId: string, data: CreatePostInputDTO) => Promise<PostDTO | null>
  getAllByDatePaginated: (userId: string, includeComments: boolean, options: CursorPagination) => Promise<ExtendedPostDTO[]>
  delete: (postId: string) => Promise<void>
  getById: (userId: string, postId: string) => Promise<PostDTO | null>
  getByAuthorId: (userId: string, comments: boolean, authorId: string) => Promise<ExtendedPostDTO[] | null>
  getByParentId: (userId: string, postId: string, options: CursorPagination) => Promise<ExtendedPostDTO[] | null>
}
