import React, { Fragment } from "react"

import type { BookmarkProps } from "../utils"
import BatchActions from "./batch-actions"
import DetectAlert from "./detect-alert"
import EditAction from "./edit-action"
import FloatActions from "./float-actions"
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
  const [newFolderIndex, setNewFolderIndex] = React.useState<number>(null)
  const [newFolderVisible, setNewFolderVisible] = React.useState(false)

  const handleMove = (node: BookmarkProps) => {
    setNode(node)
    setMoveVisible(true)
  }

  const handleEdit = (node: BookmarkProps) => {
    setNode(node)
    setEditVisible(true)
  }

  const handleNewFolder = (node: BookmarkProps, index: number) => {
    setNode(node)
    setNewFolderIndex(index)
    setNewFolderVisible(true)
  }

  return (
    <Fragment>
      <FloatActions />
      <BatchActions />
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
        index={newFolderIndex}
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
