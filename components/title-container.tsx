import React from "react"

import { useGlobalContext } from "~/components/global-provider"
import { Message } from "~/utils"

import {
  FluentFolderAdd24Filled,
  MaterialSymbolsBookmarkRemove,
  MaterialSymbolsContentCopyRounded,
  MaterialSymbolsDelete,
  MaterialSymbolsDriveFileMoveRounded,
  MdiRename,
  MingcuteSearch2Fill,
  RiDownloadCloud2Fill
} from "./icons"

const TreeNodeTitleContainer: React.FC<{
  init(): void
  children: React.ReactNode
  node: {
    id: string
    url: string
    title: string
  }
}> = (props) => {
  const context = useGlobalContext()
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

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    context.setContextMenuNode(node)
    context.setContextMenuPosition({
      x: e.clientX,
      y: e.clientY
    })
  }

  return (
    <div onContextMenu={onContextMenu} className="flex items-center group py-1">
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