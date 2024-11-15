import classnames from "classnames"
import * as React from "react"

import { FileIcon, TinyFolderIcon } from "./icons"

const TreeItem = ({ data, activeId, nodeClassName }) => {
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
        {title}
      </summary>
      <ul>
        {children.map((child) => (
          <TreeItem
            key={child.id}
            data={child}
            activeId={activeId}
            nodeClassName={nodeClassName}
          />
        ))}
      </ul>
    </details>
  )

  if (url) {
    child = (
      <div className={classnames("py-0", { active })}>
        <FileIcon />
        {title}
      </div>
    )
  }

  return <li>{child}</li>
}

const Tree = ({
  data,
  className,
  activeId,
  nodeClassName
}: {
  data: any[]
  className?: string
  activeId?: string
  nodeClassName?: string
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
      />
    ))}
  </ul>
)

export default Tree
