import React from "react"

import { Message } from "~/utils"

import { MaterialSymbolsBookmarkRemove } from "./Icon"

const TreeNodeTitleContainer: React.FC<{
  init(): void
  children: React.ReactNode
  node: {
    id: string
    url: string
    title: string
  }
}> = (props) => {
  const { children, node, init } = props
  const { id, url } = node

  const deleteBookmark = () => {
    chrome.runtime.sendMessage(
      {
        id,
        action: Message.REMOVE_BOOKMARK
      },
      () => {
        init()
      }
    )
  }

  return (
    <div className="flex items-center group">
      <span className="flex-1">{children}</span>
      {url && (
        <button
          onClick={deleteBookmark}
          className="hidden btn btn-circle btn-sm min-h-0 w-4 h-4 group-hover:block">
          <MaterialSymbolsBookmarkRemove className="text-md text-error" />
        </button>
      )}
    </div>
  )
}

export default TreeNodeTitleContainer
