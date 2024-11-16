import React, { Fragment } from "react"

import { Message } from "~/utils"

import { GlobalActionContext } from "../global-provider"
import Modal from "../modal"
import type { BookmarkProps } from "../utils"

const NewFolderAction: React.FC<{
  node: BookmarkProps
  visible: boolean
  onClose(): void
}> = (props) => {
  const { node, visible, onClose } = props
  const globalActions = React.useContext(GlobalActionContext)

  const [newFolderName, setNewFolderName] = React.useState("新建文件夹")

  const handleCreate = () => {
    chrome.runtime.sendMessage(
      {
        action: Message.CREATE_BOOKMARK,
        payload: {
          title: newFolderName,
          parentId: node.id
        }
      },
      () => {
        onClose()
        globalActions.refresh()
      }
    )
  }

  return (
    <Modal
      onOk={handleCreate}
      title={`新建子文件夹`}
      visible={visible}
      onClose={onClose}>
      <div className="flex flex-col flex-1">
        <input
          type="text"
          placeholder="Type here"
          className="input input-bordered input-neutral w-full"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
        />
      </div>
    </Modal>
  )
}

export default NewFolderAction
