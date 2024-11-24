import classnames from "classnames"
import React, { useState } from "react"

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

const DURATION_TIME = 300

const ExpandableButtons = () => {
  const { selectedIds, setSelectedIds } = React.useContext(SelectContext)
  const [isExpanded, setIsExpanded] = useState(true)
  const [visible, setVisible] = React.useState(false)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
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

  if (!visible) return null

  return (
    <div className="fixed top-24 right-36 flex flex-col items-center">
      <button
        onClick={toggleExpand}
        className="btn btn-circle btn-neutral btn-sm z-20">
        <MingcuteMultiselectFill className="text-lg" />
      </button>

      <div
        className={classnames(
          `absolute top-10 flex flex-col items-center space-y-2 transition-all duration-${DURATION_TIME}`,
          {
            "opacity-100 translate-y-0": isExpanded,
            "opacity-0 -translate-y-10": !isExpanded
          }
        )}>
        <button className="btn btn-circle btn-sm btn-primary btn-outline group">
          <UiwChrome className="text-lg group-hover:text-white" />
        </button>
        <button className="btn btn-circle btn-sm btn-secondary btn-outline group">
          <MaterialSymbolsDriveFileMoveRounded className="text-lg group-hover:text-white" />
        </button>
        <button className="btn btn-circle btn-sm btn-info btn-outline group">
          <RiDownloadCloud2Fill className="text-lg group-hover:text-white" />
        </button>
        <button className="btn btn-circle btn-sm btn-success btn-outline group">
          <MaterialSymbolsContentCopyRounded className="text-lg group-hover:text-white" />
        </button>
        <button className="btn btn-circle btn-sm btn-accent btn-outline group">
          <MingcuteGroup2Fill className="text-lg group-hover:text-white" />
        </button>
        <button className="btn btn-circle btn-sm btn-error btn-outline group">
          <MaterialSymbolsDelete className="text-lg group-hover:text-white" />
        </button>
      </div>
    </div>
  )
}

export default ExpandableButtons
