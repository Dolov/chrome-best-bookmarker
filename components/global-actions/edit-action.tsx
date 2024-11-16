import React from "react"

import { Message } from "~/utils"

import { GlobalActionContext } from "../global-provider"
import Modal from "../modal"
import type { BookmarkProps } from "../utils"

const EditAction: React.FC<{
  node: BookmarkProps
  visible: boolean
  onClose(): void
}> = (props) => {
  const { node, visible, onClose } = props
  const globalActions = React.useContext(GlobalActionContext)
  const [url, setUrl] = React.useState("")
  const [title, setTitle] = React.useState("")

  React.useEffect(() => {
    if (!node) return
    setUrl(node.url)
    setTitle(node.originalTitle)
  }, [node])

  const handleEditOk = () => {
    chrome.runtime.sendMessage(
      {
        action: Message.UPDATE_BOOKMARK,
        payload: {
          url,
          title,
          id: node.id
        }
      },
      () => {
        onClose()
        globalActions.refresh()
      }
    )
  }

  if (!node) return null
  const { originalTitle } = node

  return (
    <Modal
      onOk={handleEditOk}
      title={`编辑 ${originalTitle}`}
      visible={visible}
      onClose={onClose}>
      <div className="flex flex-col flex-1 p-1">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type here"
          className="input input-bordered w-full"
        />
        {url && (
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Type here"
            className="input input-bordered w-full mt-6"
          />
        )}
      </div>
    </Modal>
  )
}

export default EditAction
