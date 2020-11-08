import { Selection } from "../types"

export function getCategoryTitle(
  selections: Array<Selection>,
  id: string
): string {
  let title: string
  const index = selections.findIndex(selection => selection.id === id)
  if (index !== -1) {
    title = selections[index].text
    return title
  } else {
    throw new Error("That category id doesn't exist!!")
  }
}

export function getCategoryId(
  selections: Array<Selection>,
  title: string
): string {
  let id: string
  const index = selections.findIndex(selection => selection.id === title)
  if (index !== -1) {
    id = selections[index].id
    return id
  } else {
    throw new Error("That category title doesn't exist!!")
  }
}
