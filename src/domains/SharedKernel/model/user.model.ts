import { Child } from './child.model';

export type User = {
  id: number,
  username: string,
  email: string,
  avatar?: string,
  locale: string,
  lastname?: string,
  firstname?:string,
  phone?: string,
  address1?: string,
  address2?: string,
  isReferent?: boolean,
  allowNotification: boolean,
  allowNewsletter: boolean,
  shareToCommunity: boolean,
  children?: Child[]
}

export var defaultUser :User={
  id: 0,
  username: "",
  email: "",
  locale: "",
  allowNotification: true,
  allowNewsletter: true,
  shareToCommunity: true
}
