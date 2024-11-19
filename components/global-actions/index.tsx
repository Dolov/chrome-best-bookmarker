import React, { Fragment } from "react"

import type { BookmarkProps } from "../utils"
import DetectAlert from "./detect-alert"
import EditAction from "./edit-action"
import FloatButton from "./float-button"
import ItemContentMenus from "./item-content-menus"
import MoveAction from "./move-action"
import NewFolderAction from "./new-folder-action"

const GlobalActions: React.FC<{
  addKeyword: (keyword: string) => void
}> = (props) => {
  const { addKeyword } = props
  const [node, setNode] = React.useState<BookmarkProps>(null)
  const [moveVisible, setMoveVisible] = React.useState(false)
  const [editVisible, setEditVisible] = React.useState(false)
  const [newFolderVisible, setNewFolderVisible] = React.useState(false)

  const handleMove = (node: BookmarkProps) => {
    setNode(node)
    setMoveVisible(true)
  }

  const handleEdit = (node: BookmarkProps) => {
    setNode(node)
    setEditVisible(true)
  }

  const handleNewFolder = (node: BookmarkProps) => {
    setNode(node)
    setNewFolderVisible(true)
  }

  return (
    <Fragment>
      <FloatButton />
      {/* <DetectAlert /> */}
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
      <NewFolderAction
        node={node}
        onClose={() => setNewFolderVisible(false)}
        visible={newFolderVisible}
      />
      <ItemContentMenus
        addKeyword={addKeyword}
        handleMove={handleMove}
        handleEdit={handleEdit}
        handleNewFolder={handleNewFolder}
      />
    </Fragment>
  )
}

export default GlobalActions
