import React, { Fragment } from "react"

import { Message } from "~/utils"

import { GlobalActionContext, GlobalStateContext } from "../global-provider"
import {
  FileIcon,
  FluentFolderAdd24Filled,
  MaterialSymbolsBookmarkRemove,
  MaterialSymbolsContentCopyRounded,
  MaterialSymbolsDelete,
  MaterialSymbolsDriveFileMoveRounded,
  MdiCheckboxMultipleBlankCircleOutline,
  MdiCheckboxMultipleMarkedCircle,
  MdiRename,
  MingcuteSearch2Fill,
  RiDownloadCloud2Fill,
  TinyFolderIcon
} from "../icons"
import {
  copyTextToClipboard,
  downloadBookmarkAsHtml,
  getBookmarksToText
} from "../utils"
import type { BookmarkProps } from "../utils"

const ROOT_IDS = ["0", "1", "2"]

enum Actions {
  COPY = "copy",
  MOVE = "move",
  RENAME = "rename",
  SEARCH = "search",
  DELETE = "delete",
  DOWNLOAD = "download",
  DELETE_DIR = "delete-dir",
  NEW_FOLDER = "new-folder",
  CHECKBOX = "checkbox",
  UNCHECKBOX = "uncheckbox"
}

const ItemContentMenus: React.FC<{
  addKeyword: (keyword: string) => void
  handleMove: (node: BookmarkProps) => void
  handleEdit: (node: BookmarkProps) => void
  handleNewFolder: (node: BookmarkProps) => void
}> = (props) => {
  const { addKeyword, handleMove, handleEdit, handleNewFolder } = props
  const menuRef = React.useRef(null)
  const globalState = React.useContext(GlobalStateContext)
  const globalActions = React.useContext(GlobalActionContext)

  const { contextMenuNode, checkboxVisible, contextMenuPosition } = globalState

  const clear = () => {
    globalActions.setContextMenuNode(null)
    globalActions.setContextMenuPosition(null)
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
    const { id, url } = contextMenuNode

    const actions = {
      rename: {
        title: "重命名",
        Icon: MdiRename,
        key: Actions.RENAME
      },
      move: {
        title: "移动",
        Icon: MaterialSymbolsDriveFileMoveRounded,
        key: Actions.MOVE
      },
      search: {
        title: "搜索",
        Icon: MingcuteSearch2Fill,
        key: Actions.SEARCH
      },
      copy: {
        title: "复制",
        Icon: MaterialSymbolsContentCopyRounded,
        key: Actions.COPY
      },
      delete: {
        title: "删除",
        Icon: MaterialSymbolsBookmarkRemove,
        key: Actions.DELETE,
        className: "text-error font-bold"
      },
      deleteDir: {
        title: "删除",
        Icon: MaterialSymbolsDelete,
        key: Actions.DELETE_DIR,
        className: "text-error font-bold"
      },
      newFolder: {
        title: "新建文件夹",
        Icon: FluentFolderAdd24Filled,
        key: Actions.NEW_FOLDER
      },
      download: {
        title: "下载",
        Icon: RiDownloadCloud2Fill,
        key: Actions.DOWNLOAD
      },
      checkbox: {
        title: "多选",
        Icon: MdiCheckboxMultipleMarkedCircle,
        key: Actions.CHECKBOX
      },
      uncheckbox: {
        title: "取消多选",
        Icon: MdiCheckboxMultipleBlankCircleOutline,
        key: Actions.UNCHECKBOX
      }
    }

    const checkbox = checkboxVisible ? actions.uncheckbox : actions.checkbox

    if (url) {
      return [
        actions.rename,
        actions.search,
        checkbox,
        actions.copy,
        actions.move,
        actions.delete
      ]
    }

    // root dir can't be deleted
    if (ROOT_IDS.includes(id)) {
      return [actions.copy, actions.move, actions.download, actions.newFolder]
    }
    return [
      actions.rename,
      actions.newFolder,
      actions.search,
      checkbox,
      actions.download,
      actions.copy,
      actions.move,
      actions.deleteDir
    ]
  }, [contextMenuNode, checkboxVisible])

  const handleAction = (action: (typeof actions)[0]) => {
    const { key } = action
    const { id, url, originalTitle, children } = contextMenuNode
    if (key === Actions.DELETE) {
      chrome.runtime.sendMessage(
        {
          id,
          action: Message.REMOVE_BOOKMARK
        },
        () => {
          clear()
          globalActions.refresh()
        }
      )
    }

    if (key === Actions.DELETE_DIR) {
      chrome.runtime.sendMessage(
        {
          id,
          action: Message.REMOVE_BOOKMARK_TREE
        },
        () => {
          clear()
          globalActions.refresh()
        }
      )
    }

    if (key === Actions.COPY) {
      if (url) {
        copyTextToClipboard(url)
      } else {
        const text = getBookmarksToText(children)
        copyTextToClipboard(text)
      }
      clear()
    }

    if (key === Actions.SEARCH) {
      addKeyword(originalTitle)
      clear()
    }

    if (key === Actions.MOVE) {
      handleMove(contextMenuNode)
      clear()
    }

    if (key === Actions.RENAME) {
      handleEdit(contextMenuNode)
      clear()
    }

    if (key === Actions.NEW_FOLDER) {
      handleNewFolder(contextMenuNode)
      clear()
    }

    if (key === Actions.DOWNLOAD) {
      downloadBookmarkAsHtml(children, originalTitle)
      clear()
    }

    if (key === Actions.CHECKBOX) {
      globalActions.setCheckboxVisible(true)
      clear()
    }

    if (key === Actions.UNCHECKBOX) {
      globalActions.setCheckboxVisible(false)
      clear()
    }
  }

  if (!contextMenuNode) return null

  const { url, title } = contextMenuNode
  const TitleIcon = url ? FileIcon : TinyFolderIcon

  return (
    <Fragment>
      <ul
        ref={menuRef}
        style={{ top: contextMenuPosition?.y, left: contextMenuPosition?.x }}
        tabIndex={0}
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
    </Fragment>
  )
}

export default ItemContentMenus
