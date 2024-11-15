import React, { Fragment } from "react"

import type { BookmarkProps } from "../utils"
import ItemContentMenus from "./item-content-menus"
import MoveAction from "./move-action"

const GlobalActions: React.FC<{
  addKeyword: (keyword: string) => void
}> = (props) => {
  const { addKeyword } = props
  const [node, setNode] = React.useState<BookmarkProps>(null)
  const [moveVisible, setMoveVisible] = React.useState(false)

  const handleMove = (node: BookmarkProps) => {
    setNode(node)
    setMoveVisible(true)
  }

  return (
    <Fragment>
      <MoveAction
        node={node}
        onClose={() => setMoveVisible(false)}
        visible={moveVisible}
      />
      <ItemContentMenus addKeyword={addKeyword} handleMove={handleMove} />
    </Fragment>
  )
}

export default GlobalActions
