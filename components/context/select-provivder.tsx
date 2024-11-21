import * as React from "react"

export interface SelectContextProps {
  selectIds: string[]
  cancelSelect: () => void
}

export const SelectContext = React.createContext<SelectContextProps>({
  selectIds: [],
  cancelSelect: () => {}
})
