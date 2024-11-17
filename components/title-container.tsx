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

  // React.useEffect(() => {
  //   console.log("init")
  //   return () => {
  //     console.log("卸载")
  //   }
  // }, [])

  // console.log("render")

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

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    // 获取鼠标点击的 Y 坐标
    const mouseY = event.clientY
    const mouseX = event.clientX

    // 获取页面的总高度和窗口的可视高度
    const pageHeight = document.documentElement.scrollHeight

    // 计算鼠标下方和上方的剩余空间
    const spaceBelow = pageHeight - mouseY // 鼠标下方的空间
    const spaceAbove = mouseY // 鼠标上方的空间

    // 假设菜单的高度
    const menuHeight = url ? 316 : 404 // 你可以根据实际菜单高度动态调整

    // 默认菜单位置是鼠标点击位置
    let newMenuPosition = { x: mouseX, y: mouseY }

    // 判断是否有足够的空间显示菜单
    if (spaceBelow >= menuHeight) {
      // 如果下方有足够的空间，显示在鼠标下方
      newMenuPosition.y = mouseY
    } else if (spaceAbove >= menuHeight) {
      // 如果下方没有足够的空间，上方有足够的空间，显示在鼠标上方
      newMenuPosition.y = mouseY - menuHeight
    } else {
      // 如果上下都没有足够的空间，这里可以选择显示在某个固定位置或其他逻辑
      // 例如，显示在页面中间或其他位置
      newMenuPosition.y = Math.max(0, pageHeight - menuHeight)
    }

    // 更新上下文菜单的显示位置
    globalActions.setContextMenuNode(node)
    globalActions.setContextMenuPosition(newMenuPosition)
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
