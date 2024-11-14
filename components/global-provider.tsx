import * as React from "react"

import type { BookmarkProps } from "./utils"

export const GlobalActionContext = React.createContext<{
  setContextMenuNode(node: BookmarkProps): void
  setContextMenuPosition(position: { x: number; y: number }): void
  refresh(): void
}>({
  refresh: () => {},
  setContextMenuNode: () => {},
  setContextMenuPosition: () => {}
})

export const GlobalStateContext = React.createContext<{
  dataSource: BookmarkProps[]
  contextMenuNode: BookmarkProps
  contextMenuPosition: { x: number; y: number }
}>({
  dataSource: [],
  contextMenuNode: null,
  contextMenuPosition: null
})
