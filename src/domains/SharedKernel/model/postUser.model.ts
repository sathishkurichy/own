import { PostChildren } from './postChildren.model'

export type PostUser = {
  locale: string,
  email: string,
  username: string,
  password: string,
  allowNotification?: boolean,
  allowNewsletter?: boolean,
  children?: Array<PostChildren>
}

export var defaultPostUser: PostUser = {
  locale: '',
  email: '',
  username: '',
  password: '',
  allowNewsletter: true,
  allowNotification: false,
  children: new Array<PostChildren>()
}