import React, { Fragment } from "react"

import type { BookmarkProps } from "../utils"
import EditAction from "./edit-action"
import ItemContentMenus from "./item-content-menus"
import MoveAction from "./move-action"

const GlobalActions: React.FC<{
  addKeyword: (keyword: string) => void
}> = (props) => {
  const { addKeyword } = props
  const [node, setNode] = React.useState<BookmarkProps>(null)
  const [moveVisible, setMoveVisible] = React.useState(false)
  const [editVisible, setEditVisible] = React.useState(false)

  const handleMove = (node: BookmarkProps) => {
    setNode(node)
    setMoveVisible(true)
  }

  const handleEdit = (node: BookmarkProps) => {
    setNode(node)
    setEditVisible(true)
  }

  return (
    <Fragment>
      <MoveAction
        node={node}
        onClose={() => setMoveVisible(false)}
        visible={moveVisible}
      />
      <EditAction
        node={node}
        onClose={() => setEditVisible(false)}
        visible={editVisible}
      />
      <ItemContentMenus
        addKeyword={addKeyword}
        handleMove={handleMove}
        handleEdit={handleEdit}
      />
    </Fragment>
  )
}

export default GlobalActions
