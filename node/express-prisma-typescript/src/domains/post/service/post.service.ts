import { CreatePostInputDTO, ExtendedPostDTO, PostDTO } from '../dto'

export interface PostService {
  createPost: (userId: string, body: CreatePostInputDTO) => Promise<PostDTO>
  commentPost: (userId: string, postId: string, body: CreatePostInputDTO) => Promise<PostDTO | null>
  deletePost: (userId: string, postId: string) => Promise<void>
  getPost: (userId: string, postId: string) => Promise<ExtendedPostDTO>
  getLatestPosts: (userId: string, options: { limit?: number, before?: string, after?: string }, withComments?: boolean) => Promise<ExtendedPostDTO[]>
  getPostsByAuthor: (userId: any, authorId: string, comments?: boolean) => Promise<ExtendedPostDTO[]>
  getByParentId: (userId: string, postId: string, options: { limit?: number, before?: string, after?: string }) => Promise<ExtendedPostDTO[]>
}
