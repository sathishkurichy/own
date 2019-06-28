export type PostChildren = {
  name: string,
  gender: string,
  birthdate: string,
  weight?: number,
  allergenics?: Array<number>,
  allergies?: Array<number>,
  diets?: Array<number>
}

export var defaultPostChildren: PostChildren = {
  name: '',
  gender: '',
  birthdate: '',
  allergies: new Array<number>()
}