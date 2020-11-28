import { Giver } from './Giver'

export interface Gift {
  name: string
}

export interface GeneratedGift extends Gift {
  giver: Giver
}
