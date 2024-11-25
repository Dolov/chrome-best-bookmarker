import classnames from "classnames"
import * as React from "react"

import { FileIcon, TinyFolderIcon } from "./icons"
import { getChildrenIds } from "./utils"

interface TreeItemProps {
  node: any
  activeId?: string
  checkbox?: boolean
  selectedIds?: string[]
  nodeClassName?: string
  handleItemClick?: (data: any, e: React.MouseEvent) => void
  handleCheckboxChange?: (node: any, checked: boolean) => void
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  activeId,
  checkbox,
  nodeClassName,
  selectedIds = [],
  handleItemClick = () => {},
  handleCheckboxChange = () => {}
}) => {
  const { id, children = [], url, title } = node
  const active = id === activeId
  const isLeaf = children.length === 0
  const checked = selectedIds.includes(id) || false

  const inputId = React.useMemo(() => {
    return `input-${Date.now()}-${id}`
  }, [id])

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    handleCheckboxChange(node, checked)
  }

  const onTitleClick = (e: React.MouseEvent) => {
    handleItemClick(node, e)
    handleCheckboxChange(node, !checked)
  }

  React.useEffect(() => {
    if (url) return
    const childrenIds = getChildrenIds(node)
    const allChecked = childrenIds.every((id) => selectedIds.includes(id))
    const notChecked = childrenIds.every((id) => !selectedIds.includes(id))
    const input = document.querySelector(`#${inputId}`) as HTMLInputElement
    if (!input) return
    if (!notChecked && !allChecked) {
      input.indeterminate = true
    } else {
      input.indeterminate = false
    }
  }, [selectedIds])

  const wrapperClassNames = classnames("py-0", "flex", nodeClassName, {
    active
    // "no-after": isLeaf
  })

  const checkboxJsx = checkbox && (
    <input
      id={inputId}
      type="checkbox"
      checked={checked}
      onChange={onCheckboxChange}
      className={classnames("checkbox checkbox-xs", {
        "checkbox-accent": !isLeaf,
        "checkbox-secondary": isLeaf
      })}
    />
  )

  const titleJsx = (
    <div
      className="h-full flex-1 flex items-center title-jsx"
      onClick={onTitleClick}>
      {title}
    </div>
  )

  let child = (
    <details open>
      <summary className={wrapperClassNames}>
        {checkboxJsx}
        <TinyFolderIcon />
        {titleJsx}
      </summary>
      <ul>
        {children.map((child) => (
          <TreeItem
            key={child.id}
            node={{
              ...child,
              parentNode: node
            }}
            activeId={activeId}
            checkbox={checkbox}
            selectedIds={selectedIds}
            nodeClassName={nodeClassName}
            handleItemClick={handleItemClick}
            handleCheckboxChange={handleCheckboxChange}
          />
        ))}
      </ul>
    </details>
  )

  if (url) {
    child = (
      <div className={wrapperClassNames}>
        {checkboxJsx}
        <FileIcon />
        {titleJsx}
      </div>
    )
  }

  return <li>{child}</li>
}

const Tree = (props: {
  data: any[]
  activeId?: string
  checkbox?: boolean
  className?: string
  nodeClassName?: string
  selectedIds?: string[]
  handleItemClick?: (node: any, e: React.MouseEvent) => void
  handleCheckboxChange?: (selectedIds: string[]) => void
}) => {
  const {
    data,
    activeId,
    checkbox,
    className,
    selectedIds,
    nodeClassName,
    handleItemClick,
    handleCheckboxChange
  } = props

  const checkedChain = (node, nextIds) => {
    if (!node.parentNode) return nextIds

    const parentNode = node.parentNode

    // 获取父节点的所有子节点 ID
    const ids = parentNode.children.map((item) => item.id)

    // 检查父节点的所有子节点是否都被选中
    const allChecked = ids.every((id) => nextIds.includes(id))

    if (allChecked) {
      // 如果父节点满足条件，且尚未包含在 nextIds 中
      if (!nextIds.includes(parentNode.id)) {
        nextIds.push(parentNode.id) // 直接添加父节点 ID
      }

      // 递归处理父节点
      return checkedChain(parentNode, nextIds)
    }

    return nextIds // 如果父节点不满足条件，返回当前链
  }

  const unCheckedChain = (node, nextIds) => {
    if (!node.parentNode) return nextIds // 递归终止，没有父节点

    const parentNode = node.parentNode

    // 获取父节点的所有子节点 ID
    const ids = parentNode.children.map((item) => item.id)

    // 检查父节点是否有未选中的子节点
    const anyUnchecked = ids.some((id) => !nextIds.includes(id))

    if (anyUnchecked) {
      // 如果父节点不满足全选条件，从 nextIds 中移除父节点 ID
      const index = nextIds.indexOf(parentNode.id)
      if (index > -1) {
        nextIds.splice(index, 1) // 移除父节点 ID
      }

      // 递归处理父节点
      return unCheckedChain(parentNode, nextIds)
    }

    return nextIds // 如果父节点满足条件，不再向上递归
  }

  const handleItemCheckboxChange = (node, checked) => {
    const { id: nodeId } = node
    if (checked) {
      const childrenIds = getChildrenIds(node)
      let nextIds = [...selectedIds, nodeId, ...childrenIds]
      const chain = checkedChain(node, nextIds)
      handleCheckboxChange(chain)
      return
    }
    const childrenIds = getChildrenIds(node)
    const nextIds = selectedIds.filter(
      (id) => id !== nodeId && !childrenIds.includes(id)
    )
    const chain = unCheckedChain(node, nextIds)
    handleCheckboxChange(chain)
  }

  return (
    <ul
      className={classnames(
        "menu menu-xs bg-base-200 rounded-lg w-full",
        className
      )}>
      {data.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          activeId={activeId}
          checkbox={checkbox}
          selectedIds={selectedIds}
          nodeClassName={nodeClassName}
          handleItemClick={handleItemClick}
          handleCheckboxChange={handleItemCheckboxChange}
        />
      ))}
    </ul>
  )
}

export default Tree
