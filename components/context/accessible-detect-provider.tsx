import * as React from "react"

import type { BookmarkProps } from "../utils"

export interface AccessibleDetectContextProps {
  endTime: number
  startTime: number
  status: "done" | "loading" | "idle"
  index: number
  failIds: string[]
  successIds: string[]
  currentNode: BookmarkProps
  setAccessibleDetectInfo(
    info: Partial<Omit<AccessibleDetectContextProps, "setAccessibleDetectInfo">>
  ): void
}

export const AccessibleDetectContext =
  React.createContext<AccessibleDetectContextProps>({
    endTime: null,
    startTime: null,
    status: "idle",
    index: 0,
    failIds: [],
    successIds: [],
    currentNode: null,
    setAccessibleDetectInfo: () => {}
  })
