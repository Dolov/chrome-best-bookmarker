import * as React from "react"

import type { BookmarkProps } from "./utils"

// Step 1: Create the GlobalContext
const GlobalContext = React.createContext<{
  contextMenuNode: BookmarkProps | null
  contextMenuPosition: { x: number; y: number } | null
  setContextMenuNode: React.Dispatch<React.SetStateAction<BookmarkProps | null>>
  setContextMenuPosition: React.Dispatch<
    React.SetStateAction<{ x: number; y: number } | null>
  >
  init(): void
  setInit: React.Dispatch<React.SetStateAction<() => void>>
}>({
  contextMenuNode: null,
  contextMenuPosition: null,
  setContextMenuNode: () => {},
  setContextMenuPosition: () => {},
  init: () => {},
  setInit: () => {}
})

// Step 2: Create a GlobalProvider component to wrap your app
export const GlobalProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [contextMenuNode, setContextMenuNode] =
    React.useState<HTMLElement | null>(null)

  const [contextMenuPosition, setContextMenuPosition] = React.useState<{
    x: number
    y: number
  } | null>(null)

  const [init, setInit] = React.useState<() => void>(null)

  return (
    <GlobalContext.Provider
      value={{
        contextMenuNode,
        contextMenuPosition,
        setContextMenuNode,
        setContextMenuPosition,
        init,
        setInit
      }}>
      {children}
    </GlobalContext.Provider>
  )
}

// Step 3: Create a custom hook to use the global context
export const useGlobalContext = () => {
  const context = React.useContext(GlobalContext)

  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider")
  }

  return context
}
