export type Person = {
  id: number
  name: string
}

export interface IMessageBody {
  rounder: Person
  patient: Person
  delay: string
  location: string
}
