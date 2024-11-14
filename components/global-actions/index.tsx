import React, { Fragment } from "react"

import { GlobalStateContext } from "../global-provider"
import Modal from "../modal"
import Tree from "../tree"
import type { BookmarkProps } from "../utils"
import { getDirectories } from "../utils"
import ItemContentMenus from "./item-content-menus"

const GlobalActions: React.FC<{
  addKeyword: (keyword: string) => void
}> = (props) => {
  const { addKeyword } = props
  const { dataSource } = React.useContext(GlobalStateContext)
  const [node, setNode] = React.useState<BookmarkProps>(null)
  const [moveVisible, setMoveVisible] = React.useState(false)

  const directories = React.useMemo(() => {
    return getDirectories(dataSource)
  }, [dataSource])

  const handleMove = (node: BookmarkProps) => {
    setNode(node)
    setMoveVisible(true)
  }

  return (
    <Fragment>
      <Modal
        title={`移动 ${node?.originalTitle} 到...`}
        visible={moveVisible}
        onOk={() => setMoveVisible(false)}
        onClose={() => setMoveVisible(false)}>
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="p-2 pb-4">
            <input
              type="text"
              placeholder="Type here"
              className="input input-bordered input-neutral w-full bt-2 rounded-full"
            />
          </div>
          <div className="px-2 flex-1 overflow-auto">
            <Tree data={directories} />
          </div>
        </div>
      </Modal>
      <ItemContentMenus addKeyword={addKeyword} handleMove={handleMove} />
    </Fragment>
  )
}

export default GlobalActions
