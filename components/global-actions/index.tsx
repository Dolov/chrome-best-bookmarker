import React, { Fragment } from "react"

import { Message } from "~/utils"

import DirTree from "../dir-tree"
import { GlobalActionContext } from "../global-provider"
import Modal from "../modal"
import type { BookmarkProps } from "../utils"
import ItemContentMenus from "./item-content-menus"

const GlobalActions: React.FC<{
  addKeyword: (keyword: string) => void
}> = (props) => {
  const { addKeyword } = props
  const globalActions = React.useContext(GlobalActionContext)
  const [node, setNode] = React.useState<BookmarkProps>(null)
  const [moveVisible, setMoveVisible] = React.useState(false)

  const [keyword, setKeyword] = React.useState("")
  const [parentNode, setParentNode] = React.useState(null)

  const handleMove = (node: BookmarkProps) => {
    setNode(node)
    setMoveVisible(true)
  }

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
        setMoveVisible(false)
        globalActions.refresh()
      }
    )
  }

  const handleClickItem = (node: BookmarkProps, e: React.MouseEvent) => {
    setParentNode(node)
    e.preventDefault()
  }

  return (
    <Fragment>
      <Modal
        width={800}
        title={`移动 ${node?.originalTitle} 到...`}
        visible={moveVisible}
        onOk={handleMoveOk}
        onClose={() => setMoveVisible(false)}>
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
      <ItemContentMenus addKeyword={addKeyword} handleMove={handleMove} />
    </Fragment>
  )
}

export default GlobalActions
