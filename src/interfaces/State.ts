import { GeneratedGift } from './Gift'
import { Item } from './Items'

export interface State {
  itemsStatus: Item[]
  history: GeneratedGift[]
}
