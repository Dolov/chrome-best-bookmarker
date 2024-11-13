import classnames from "classnames"
import * as React from "react"

import { FileIcon, TinyFolderIcon } from "./icons"

const TreeItem = ({ data, activeId }) => {
  const active = data.id === activeId
  return (
    <li>
      {data.url ? (
        <div className={classnames("py-0", { active })}>
          <FileIcon />
          {data.title}
        </div>
      ) : (
        <details open>
          <summary className={classnames("py-0", { active })}>
            <TinyFolderIcon />
            {data.title}
          </summary>
          <ul>
            {data.children &&
              data.children.map((child, index) => (
                <TreeItem key={index} data={child} activeId={activeId} />
              ))}
          </ul>
        </details>
      )}
    </li>
  )
}

const Tree = ({
  data,
  className,
  activeId
}: {
  data: any[]
  className?: string
  activeId?: string
}) => (
  <ul
    className={classnames(
      "menu menu-xs bg-base-200 rounded-lg w-full",
      className
    )}>
    {data.map((data, index) => (
      <TreeItem key={index} data={data} activeId={activeId} />
    ))}
  </ul>
)

export default Tree
