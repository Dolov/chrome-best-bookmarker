import React from "react"

import useDebouncedValue from "~hooks/useDebouncedValue"

import { GlobalStateContext } from "./global-provider"
import Tree from "./tree"
import { getDirectories, matchTreeData } from "./utils"

const DirTree: React.FC<{
  keyword?: string
}> = (props) => {
  const { keyword } = props
  const debouncedKeyword = useDebouncedValue(keyword, 300)
  const { dataSource } = React.useContext(GlobalStateContext)

  const directories = React.useMemo(() => {
    return getDirectories(dataSource)
  }, [dataSource])

  const treeData = React.useMemo(() => {
    if (!debouncedKeyword) return directories
    return matchTreeData(directories, debouncedKeyword)
  }, [directories, debouncedKeyword])

  return <Tree nodeClassName="py-1" data={treeData} />
}

export default DirTree
