import React from "react"

import { Message } from "~/utils"

import { useGlobalContext } from "../global-provider"
import {
  FileIcon,
  FluentFolderAdd24Filled,
  MaterialSymbolsBookmarkRemove,
  MaterialSymbolsContentCopyRounded,
  MaterialSymbolsDelete,
  MaterialSymbolsDriveFileMoveRounded,
  MdiRename,
  MingcuteSearch2Fill,
  RiDownloadCloud2Fill,
  TinyFolderIcon
} from "../icons"

const ItemContentMenus: React.FC<{}> = () => {
  const menuRef = React.useRef(null)
  const context = useGlobalContext()
  const { contextMenuNode, contextMenuPosition } = context

  const clear = () => {
    context.setContextMenuNode(null)
    context.setContextMenuPosition(null)
  }

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      clear()
    }
  }

  React.useEffect(() => {
    if (contextMenuNode) {
      document.addEventListener("click", handleClickOutside)
    } else {
      document.removeEventListener("click", handleClickOutside)
    }
    return () => document.removeEventListener("click", handleClickOutside)
  }, [contextMenuNode])

  const actions: {
    key: string
    Icon: React.FC<React.SVGProps<SVGSVGElement>>
    title: string
    className?: string
  }[] = React.useMemo(() => {
    if (!contextMenuNode) return []
    const { url, title } = contextMenuNode

    const actions = {
      rename: {
        title: "重命名",
        Icon: MdiRename,
        key: "rename"
      },
      move: {
        title: "移动",
        Icon: MaterialSymbolsDriveFileMoveRounded,
        key: "move"
      },
      search: {
        title: "搜索",
        Icon: MingcuteSearch2Fill,
        key: "search"
      },
      copy: {
        title: "复制",
        Icon: MaterialSymbolsContentCopyRounded,
        key: "copy"
      },
      delete: {
        title: "删除",
        Icon: MaterialSymbolsBookmarkRemove,
        key: "delete",
        className: "text-error font-bold"
      },
      deleteDir: {
        title: "删除",
        Icon: MaterialSymbolsDelete,
        key: "delete-dir",
        className: "text-error font-bold"
      }
    }

    if (url) {
      return [
        actions.rename,
        actions.search,
        actions.copy,
        actions.move,
        actions.delete
      ]
    }
    return [
      actions.rename,
      actions.search,
      actions.copy,
      actions.move,
      actions.deleteDir
    ]
  }, [contextMenuNode])

  const handleAction = (action: (typeof actions)[0]) => {
    const { key } = action
    if (key === "delete") {
      chrome.runtime.sendMessage(
        {
          id: contextMenuNode.id,
          action: Message.REMOVE_BOOKMARK
        },
        () => {
          clear()
          context.init()
        }
      )
      return
    }

    if (key === "delete-dir") {
      chrome.runtime.sendMessage(
        {
          id: contextMenuNode.id,
          action: Message.REMOVE_BOOKMARK_TREE
        },
        () => {
          clear()
          context.init()
        }
      )
      return
    }
  }

  if (!contextMenuNode) return null

  const { url, title } = contextMenuNode
  const TitleIcon = url ? FileIcon : TinyFolderIcon

  return (
    <ul
      ref={menuRef}
      tabIndex={0}
      style={{ top: contextMenuPosition?.y, left: contextMenuPosition?.x }}
      className="dropdown-content menu bg-base-100 rounded-box z-[1] min-w-40 max-w-52 p-2 shadow fixed">
      <li title={title} className="menu-title w-full">
        <p className="w-full flex items-center">
          <TitleIcon className="w-4 min-w-4" />
          <span className="ml-2 flex-1 text-ellipsis">{title}</span>
        </p>
      </li>
      {actions.map((action) => {
        const { key, title, Icon, className } = action
        return (
          <li
            key={key}
            className={className}
            onClick={() => handleAction(action)}>
            <a>
              <Icon className="text-lg" />
              {title}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

export default ItemContentMenus
