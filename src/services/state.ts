import fs from 'fs'
import util from 'util'

import { GeneratedGift } from '../interfaces/Gift'
import { Item } from '../interfaces/Items'
import { State } from '../interfaces/State'
import { getAllGifts } from './gifts'

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const INITIAL_STATE: State = {
  itemsStatus: [],
  history: [],
}

const initState = async (): Promise<State> => {
  try {
    await saveState(INITIAL_STATE)
  } catch (err) {
    console.error(err)
  } finally {
    return INITIAL_STATE
  }
}

export const saveState = async (newState: State): Promise<void> =>
  writeFile(process.env.DB_FILE, JSON.stringify(newState, null, 2), 'utf8')

export const saveGiftsToState = async (
  currentState: State,
  gifts: GeneratedGift[]
): Promise<void> => {
  const history = [...currentState.history, ...gifts]

  return saveState({
    history,
    itemsStatus: history.reduce((items, gift) => {
      const index = items.findIndex((item) => item.name === gift.name)
      const oldQuantity = index > -1 ? items[index].giftedCount : 0

      const item = {
        name: gift.name,
        giftedCount: oldQuantity + 1,
      }

      if (index > -1) {
        items[index] = item
        return items
      }

      return [...items, item]
    }, [] as Item[]),
  })
}

export const getState = async (): Promise<State> => {
  try {
    const fileContent = await readFile(process.env.DB_FILE, 'utf8')
    return JSON.parse(fileContent)
  } catch {
    return initState()
  }
}
