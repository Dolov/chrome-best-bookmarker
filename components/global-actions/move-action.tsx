import React, { Fragment } from "react"

import { Message } from "~/utils"

import { GlobalActionContext } from "../context/global-provider"
import DirTree from "../dir-tree"
import Modal from "../modal"
import type { BookmarkProps } from "../utils"

const MoveAction: React.FC<{
  node: BookmarkProps
  visible: boolean
  onClose(): void
}> = (props) => {
  const { node, visible, onClose } = props
  const globalActions = React.useContext(GlobalActionContext)

  const [keyword, setKeyword] = React.useState("")
  const [parentNode, setParentNode] = React.useState(null)

  const handleMoveOk = () => {
    chrome.runtime.sendMessage(
      {
        action: Message.MOVE_BOOKMARK,
        payload: {
          ...node,
          index: 0,
          parentId: parentNode.id
        }
      },
      () => {
        onClose()
        globalActions.refresh()
      }
    )
  }

  const handleClickItem = (node: BookmarkProps, e: React.MouseEvent) => {
    setParentNode(node)
    e.preventDefault()
  }

  return (
    <Modal
      width={800}
      onOk={handleMoveOk}
      title={`移动 ${node?.originalTitle} 到...`}
      visible={visible}
      onClose={onClose}>
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="p-2 pb-4">
          <input
            type="text"
            placeholder="Type here"
            className="input input-bordered input-neutral w-full bt-2 rounded-full"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <div className="px-2 flex-1 overflow-auto">
          <DirTree
            keyword={keyword}
            activeId={parentNode?.id}
            handleClickItem={handleClickItem}
          />
        </div>
      </div>
    </Modal>
  )
}

export default MoveAction
