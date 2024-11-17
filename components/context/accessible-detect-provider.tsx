import * as React from "react"

import type { BookmarkProps } from "../utils"

export const AccessibleDetectContext = React.createContext<{
  index: number
  failIds: string[]
  successIds: string[]
  currentNode: BookmarkProps
  setAccessibleDetectInfo(info): void
}>({
  index: 0,
  failIds: [],
  successIds: [],
  currentNode: null,
  setAccessibleDetectInfo: () => {}
})
