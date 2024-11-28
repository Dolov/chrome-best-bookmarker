import classnames from "classnames"
import React, { useState } from "react"

import { Message } from "~/utils"

import {
  GlobalActionContext,
  GlobalStateContext
} from "../context/global-provider"
import { SelectContext } from "../context/select-provivder"
import {
  MaterialSymbolsContentCopyRounded,
  MaterialSymbolsDelete,
  MaterialSymbolsDriveFileMoveRounded,
  MingcuteGroup2Fill,
  MingcuteMultiselectFill,
  RiDownloadCloud2Fill,
  UiwChrome
} from "../icons"
import Modal from "../modal"
import { findNodeById, getChildrenIds } from "../utils"

const DURATION_TIME = 300

const ExpandableButtons = () => {
  const { dataSource } = React.useContext(GlobalStateContext)
  const globalActions = React.useContext(GlobalActionContext)
  const { selectedIds, setSelectedIds } = React.useContext(SelectContext)
  const [isExpanded, setIsExpanded] = useState(true)
  const [visible, setVisible] = React.useState(false)
  const [deleteVisible, setDeleteVisible] = React.useState(false)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  const clearSelected = () => {
    setSelectedIds([])
  }

  React.useEffect(() => {
    const visible = selectedIds.length > 0
    setIsExpanded(visible)
    if (visible) {
      setVisible(true)
    } else {
      setTimeout(() => setVisible(false), DURATION_TIME)
    }
  }, [selectedIds])

  const deleteAction = async () => {
    let idsToDelete = [...selectedIds]

    while (idsToDelete.length > 0) {
      const currentId = idsToDelete.shift()
      const currentNode = findNodeById(dataSource, currentId)
      if (!currentNode) continue

      const childIds = getChildrenIds(currentNode)
      idsToDelete = idsToDelete.filter(
        (id) => id !== currentNode.id && !childIds.includes(id)
      )

      const messageAction = currentNode.url
        ? Message.REMOVE_BOOKMARK
        : Message.REMOVE_BOOKMARK_TREE

      await chrome.runtime.sendMessage({
        id: currentId,
        action: messageAction
      })
    }

    globalActions.refresh()
    setDeleteVisible(false)
    setTimeout(() => {
      setSelectedIds([])
    }, 0)
  }

  const handleDelete = async () => {
    if (!selectedIds.length) return
    if (selectedIds.length === 1) {
      await deleteAction()
      return
    }
    setDeleteVisible(true)
  }

  if (!visible) return null

  return (
    <div className="absolute top-24 -right-20 flex flex-col items-center">
      <div className="indicator">
        <span className="indicator-item badge badge-secondary z-30 group">
          {selectedIds.length}
          <button
            onClick={clearSelected}
            className="hidden text-[8px] btn btn-circle btn-ghost btn-sm min-h-0 w-3 h-3 ml-1 group-hover:block">
            ✕
          </button>
        </span>
        <button
          onClick={toggleExpand}
          className="btn btn-circle btn-neutral btn-sm z-20">
          <MingcuteMultiselectFill className="text-lg" />
        </button>
      </div>

      <div
        className={classnames(
          `absolute top-10 flex flex-col items-center space-y-2 transition-all duration-${DURATION_TIME}`,
          {
            "opacity-100 translate-y-0": isExpanded,
            "opacity-0 -translate-y-10": !isExpanded
          }
        )}>
        <div data-tip="打开" className="tooltip tooltip-right">
          <button className="btn btn-circle btn-sm btn-primary btn-outline group">
            <UiwChrome className="text-lg group-hover:text-white" />
          </button>
        </div>

        <div data-tip="移动" className="tooltip tooltip-right">
          <button className="btn btn-circle btn-sm btn-secondary btn-outline group">
            <MaterialSymbolsDriveFileMoveRounded className="text-lg group-hover:text-white" />
          </button>
        </div>

        <div data-tip="导出" className="tooltip tooltip-right">
          <button className="btn btn-circle btn-sm btn-info btn-outline group">
            <RiDownloadCloud2Fill className="text-lg group-hover:text-white" />
          </button>
        </div>

        <div data-tip="复制" className="tooltip tooltip-right">
          <button className="btn btn-circle btn-sm btn-success btn-outline group">
            <MaterialSymbolsContentCopyRounded className="text-lg group-hover:text-white" />
          </button>
        </div>

        <div data-tip="分享" className="tooltip tooltip-right">
          <button className="btn btn-circle btn-sm btn-accent btn-outline group">
            <MingcuteGroup2Fill className="text-lg group-hover:text-white" />
          </button>
        </div>

        <div data-tip="删除" className="tooltip tooltip-right">
          <button
            onClick={handleDelete}
            className="btn btn-circle btn-sm btn-error btn-outline group">
            <MaterialSymbolsDelete className="text-lg group-hover:text-white" />
          </button>
        </div>
        <Modal
          title="确定删除？"
          onOk={deleteAction}
          visible={deleteVisible}
          onClose={() => setDeleteVisible(false)}>
          <div className="text-sm">
            共计<strong className="px-1">{selectedIds.length}</strong>
            个文件夹及书签，删除后无法恢复，请谨慎操作。
          </div>
        </Modal>
      </div>
    </div>
  )
}

export default ExpandableButtons
