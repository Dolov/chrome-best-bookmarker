import React from "react"

import useDebouncedValue from "~hooks/useDebouncedValue"

import { GlobalStateContext } from "./global-provider"
import Tree from "./tree"
import { getDirectories, matchTreeData, type BookmarkProps } from "./utils"

const DirTree: React.FC<{
  keyword?: string
  activeId?: string
  handleClickItem?: (node: BookmarkProps, e: React.MouseEvent) => void
}> = (props) => {
  const { keyword, handleClickItem, activeId } = props
  const debouncedKeyword = useDebouncedValue(keyword, 300)
  const { dataSource } = React.useContext(GlobalStateContext)

  const directories = React.useMemo(() => {
    return getDirectories(dataSource)
  }, [dataSource])

  const treeData = React.useMemo(() => {
    if (!debouncedKeyword) return directories
    return matchTreeData(directories, debouncedKeyword)
  }, [directories, debouncedKeyword])

  return (
    <Tree
      data={treeData}
      activeId={activeId}
      nodeClassName="h-[24px]"
      handleItemClick={handleClickItem}
    />
  )
}

export default DirTree
