import classnames from "classnames"
import * as React from "react"

import { FileIcon, TinyFolderIcon } from "./icons"

interface TreeItemProps {
  data: any
  activeId?: string
  nodeClassName?: string
  handleItemClick?: (data: any, e: React.MouseEvent) => void
}

const TreeItem: React.FC<TreeItemProps> = ({
  data,
  activeId,
  nodeClassName,
  handleItemClick = () => {}
}) => {
  const { id, children = [], url, title } = data
  const active = id === activeId
  const isLeaf = children.length === 0

  let child = (
    <details open>
      <summary
        className={classnames("py-0", nodeClassName, {
          active,
          "no-after": isLeaf
        })}>
        <TinyFolderIcon />
        <div onClick={(e) => handleItemClick(data, e)}>{title}</div>
      </summary>
      <ul>
        {children.map((child) => (
          <TreeItem
            key={child.id}
            data={child}
            activeId={activeId}
            nodeClassName={nodeClassName}
            handleItemClick={handleItemClick}
          />
        ))}
      </ul>
    </details>
  )

  if (url) {
    child = (
      <div className={classnames("py-0", { active })}>
        <FileIcon />
        <div onClick={(e) => handleItemClick(data, e)}>{title}</div>
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
  handleItemClick
}: {
  data: any[]
  className?: string
  activeId?: string
  nodeClassName?: string
  handleItemClick?: (node: any, e: React.MouseEvent) => void
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
        nodeClassName={nodeClassName}
        handleItemClick={handleItemClick}
      />
    ))}
  </ul>
)

export default Tree
