import {Post, User} from '@prisma/client'

export class UserDTO {
  constructor (user: UserDTO) {
    this.id = user.id
    this.name = user.name
    this.createdAt = user.createdAt
  }

  id: string
  name: string | null
  createdAt: Date
}

export class ExtendedUserDTO extends UserDTO {
  constructor (user: ExtendedUserDTO) {
    super(user)
    this.email = user.email
    this.name = user.name
    this.password = user.password
  }

  email!: string
  username!: string
  password!: string
}
export class UserViewDTO {
  constructor (user: User) {
    this.id = user.id
    this.name = user.name
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.createdAt = user.createdAt
    this.isPrivate = user.isPrivate
  }

  id: string
  name: string | null
  username: string
  profilePicture: string | null
  createdAt: Date
  isPrivate: boolean
}

export class FullUserView {
  constructor (user: User, following: UserViewDTO[], followers: UserViewDTO[], posts: Post[]) {
    this.id = user.id
    this.name = user.name ?? ''
    this.username = user.username
    this.profilePicture = user.profilePicture
    this.isPrivate = user.isPrivate
    this.createdAt = user.createdAt
    this.followers = followers
    this.following = following
    this.posts = posts
  }

  id: string
  name?: string
  username: string
  profilePicture?: string
  isPrivate: boolean
  createdAt: Date
  followers: UserViewDTO[]
  following: UserViewDTO[]
  posts: Post[]
}
