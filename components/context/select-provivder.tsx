import * as React from "react"

export interface SelectContextProps {
  selectedIds: string[]
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

export const SelectContext = React.createContext<SelectContextProps>({
  selectedIds: [],
  setSelectedIds: () => {}
})
