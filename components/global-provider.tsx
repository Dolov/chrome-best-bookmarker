import * as React from "react"

import type { BookmarkProps } from "./utils"

export const GlobalActionContext = React.createContext<{
  setContextMenuNode(node: BookmarkProps): void
  setContextMenuPosition(position: { x: number; y: number }): void
  refresh(): void
  setCheckboxVisible(visible: boolean): void
}>({
  refresh: () => {},
  setContextMenuNode: () => {},
  setContextMenuPosition: () => {},
  setCheckboxVisible: () => {}
})

export const GlobalStateContext = React.createContext<{
  dataSource: BookmarkProps[]
  contextMenuNode: BookmarkProps
  contextMenuPosition: { x: number; y: number }
  checkboxVisible: boolean
}>({
  dataSource: [],
  contextMenuNode: null,
  contextMenuPosition: null,
  checkboxVisible: false
})
