import React from "react"

import { GlobalActionContext } from "~/components/global-provider"
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
import type { BookmarkProps } from "./utils"

const TreeNodeTitleContainer: React.FC<{
  node: BookmarkProps
  children: React.ReactNode
}> = (props) => {
  const globalActions = React.useContext(GlobalActionContext)
  const { children, node } = props
  const { id, url } = node

  React.useEffect(() => {
    console.log("init")
    return () => {
      console.log("卸载")
    }
  }, [])

  console.log("render")

  const deleteBookmark = () => {
    chrome.runtime.sendMessage(
      {
        id,
        action: Message.REMOVE_BOOKMARK
      },
      () => {
        globalActions.refresh()
      }
    )
  }

  const onContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    globalActions.setContextMenuNode(node)
    globalActions.setContextMenuPosition({
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

export default React.memo(TreeNodeTitleContainer, (prevProps, nextProps) => {
  return (
    prevProps.node.id === nextProps.node.id &&
    prevProps.node.url === nextProps.node.url &&
    prevProps.node.title === nextProps.node.title
  )
})
