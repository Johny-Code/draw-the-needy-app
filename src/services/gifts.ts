import fs from 'fs'
import util from 'util'

import { State } from '../interfaces/State'
import { getRandomFromArray } from '../helpers/random'
import { GeneratedGift, Gift } from '../interfaces/Gift'
import { Giver } from '../interfaces/Giver'

const readFile = util.promisify(fs.readFile)

export const getAllGifts = async (): Promise<Gift[]> => {
  const fileContent = await readFile(process.env.GIFTS_FILE, 'utf8')
  return JSON.parse(fileContent).map((name) => ({ name }))
}

const getAllGivers = async (): Promise<Giver[]> => {
  const fileContent = await readFile(process.env.GIVERS_FILE, 'utf8')
  return JSON.parse(fileContent).map((rawGiver) => ({ name: rawGiver.name, email: rawGiver.email }))
}

export const createGeneratedGift = (gift: Gift, giver: Giver): GeneratedGift => ({
  name: gift.name,
  giver,
})

export const generateGifts = async (state: State): Promise<GeneratedGift[]> => {
  const allGifts = await getAllGifts()
  const allGivers = await getAllGivers()

  // TODO

  return allGivers.map((giver) => {
    return createGeneratedGift(getRandomFromArray(allGifts), giver)
  })
}
