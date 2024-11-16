import classnames from "classnames"
import * as React from "react"

import { FileIcon, TinyFolderIcon } from "./icons"

interface TreeItemProps {
  data: any
  activeId?: string
  checkbox?: boolean
  nodeClassName?: string
  handleItemClick?: (data: any, e: React.MouseEvent) => void
  selectedIds?: string[]
  onCheckboxChange?: (selectedIds: string[]) => void
}

const TreeItem: React.FC<TreeItemProps> = ({
  data,
  activeId,
  checkbox,
  nodeClassName,
  handleItemClick = () => {},
  selectedIds = [],
  onCheckboxChange = () => {}
}) => {
  const { id, children = [], url, title } = data
  const active = id === activeId
  const isLeaf = children.length === 0
  const checked = selectedIds.includes(id)

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    onCheckboxChange(
      checked
        ? [...selectedIds, id]
        : selectedIds.filter((selectedId) => selectedId !== id)
    )
  }

  let child = (
    <details open>
      <summary
        className={classnames("py-0", "flex", nodeClassName, {
          active,
          "no-after": isLeaf
        })}>
        {checkbox && (
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="checkbox checkbox-accent checkbox-xs"
          />
        )}
        <TinyFolderIcon />
        <div className="flex-1" onClick={(e) => handleItemClick(data, e)}>
          {title}
        </div>
      </summary>
      <ul>
        {children.map((child) => (
          <TreeItem
            key={child.id}
            data={child}
            activeId={activeId}
            checkbox={checkbox}
            nodeClassName={nodeClassName}
            handleItemClick={handleItemClick}
            selectedIds={selectedIds}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
      </ul>
    </details>
  )

  if (url) {
    child = (
      <div className={classnames("py-0", "flex", { active })}>
        {checkbox && (
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="checkbox checkbox-secondary checkbox-xs"
          />
        )}
        <FileIcon />
        <div className="flex-1" onClick={(e) => handleItemClick(data, e)}>
          {title}
        </div>
      </div>
    )
  }

  return <li>{child}</li>
}

const Tree = ({
  data,
  className,
  activeId,
  nodeClassName,
  handleItemClick,
  checkbox,
  selectedIds,
  onCheckboxChange
}: {
  data: any[]
  activeId?: string
  checkbox?: boolean
  className?: string
  nodeClassName?: string
  handleItemClick?: (node: any, e: React.MouseEvent) => void
  selectedIds?: string[]
  onCheckboxChange?: (selectedIds: string[]) => void
}) => (
  <ul
    className={classnames(
      "menu menu-xs bg-base-200 rounded-lg w-full",
      className
    )}>
    {data.map((item) => (
      <TreeItem
        key={item.id}
        data={item}
        activeId={activeId}
        checkbox={checkbox}
        nodeClassName={nodeClassName}
        handleItemClick={handleItemClick}
        selectedIds={selectedIds}
        onCheckboxChange={onCheckboxChange}
      />
    ))}
  </ul>
)

export default Tree
