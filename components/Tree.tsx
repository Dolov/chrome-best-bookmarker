import classnames from "classnames"
import * as React from "react"

import useControllableValue from "~hooks/use-controllable-value"

import { FileIcon, TinyFolderIcon } from "./icons"
import { getChildrenIds } from "./utils"

interface TreeItemProps {
  node: any
  activeId?: string
  checkbox?: boolean
  nodeClassName?: string
  handleItemClick?: (data: any, e: React.MouseEvent) => void
  selectedIds?: string[]
  onCheckboxChange?: (node: any, checked: boolean, parentNode) => void
  parentChecked?: boolean
  parentNode?: any
}

const TreeItem: React.FC<TreeItemProps> = ({
  node,
  activeId,
  checkbox,
  nodeClassName,
  parentChecked,
  handleItemClick = () => {},
  selectedIds = [],
  onCheckboxChange = () => {},
  parentNode
}) => {
  const { id, children = [], url, title } = node
  const active = id === activeId
  const isLeaf = children.length === 0
  const checked = selectedIds.includes(id) || false

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    onCheckboxChange(node, checked, parentNode)
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
        <div
          className="flex-1 flex items-center h-full"
          onClick={(e) => handleItemClick(node, e)}>
          {title}
        </div>
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
            parentNode={node}
            selectedIds={selectedIds}
            parentChecked={checked}
            nodeClassName={nodeClassName}
            handleItemClick={handleItemClick}
            onCheckboxChange={onCheckboxChange}
          />
        ))}
      </ul>
    </details>
  )

  if (url) {
    child = (
      <div
        className={classnames("py-0", "flex", nodeClassName, {
          active
        })}>
        {checkbox && (
          <input
            type="checkbox"
            checked={checked}
            onChange={handleCheckboxChange}
            className="checkbox checkbox-secondary checkbox-xs"
          />
        )}
        <FileIcon />
        <div
          className="flex-1 flex items-center h-full"
          onClick={(e) => handleItemClick(node, e)}>
          {title}
        </div>
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
  handleItemClick?: (node: any, e: React.MouseEvent) => void
  selectedIds?: string[]
  onCheckboxChange?: (selectedIds: string[]) => void
}) => {
  const {
    data,
    className,
    activeId,
    nodeClassName,
    handleItemClick,
    checkbox
  } = props
  const [selectedIds, onCheckboxChange] = useControllableValue<string[]>(
    props,
    {
      defaultValue: [],
      valuePropName: "selectedIds",
      trigger: "onCheckboxChange"
    }
  )

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
      onCheckboxChange(chain)
      return
    }
    const childrenIds = getChildrenIds(node)
    const nextIds = selectedIds.filter(
      (id) => id !== nodeId && !childrenIds.includes(id)
    )
    const chain = unCheckedChain(node, nextIds)
    onCheckboxChange(chain)
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
          onCheckboxChange={handleItemCheckboxChange}
        />
      ))}
    </ul>
  )
}

export default Tree
