import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { formatTreeNodes, type BookmarkProps } from "~/components/utils"
import { Message, Storage } from "~/utils"
import {
  AccessibleDetectContext,
  type AccessibleDetectContextProps
} from "~components/context/accessible-detect-provider"
import {
  GlobalActionContext,
  GlobalStateContext
} from "~components/context/global-provider"
import ManageMain from "~components/manage-main"
import { useThemeChange } from "~hooks/use-setting"

import "~/tailwindcss.less"

export default () => {
  useThemeChange()
  const [settings] = useStorage(Storage.SETTINGS, {
    checkbox: true
  })
  const [dataSource, setDataSource] = React.useState([])
  const [accessibleDetectInfo, setAccessibleDetectInfo] = React.useState<
    Omit<AccessibleDetectContextProps, "setAccessibleDetectInfo">
  >({
    index: 0,
    status: "idle",
    failIds: [],
    endTime: null,
    startTime: null,
    successIds: [],
    currentNode: null
  })

  const [checkboxVisible, setCheckboxVisible] = React.useState(
    settings.checkbox
  )
  const [contextMenuNode, setContextMenuNode] =
    React.useState<BookmarkProps>(null)
  const [contextMenuPosition, setContextMenuPosition] = React.useState<{
    x: number
    y: number
  }>(null)

  React.useEffect(() => {
    init()
  }, [])

  const init = () => {
    chrome.runtime.sendMessage(
      { action: Message.GET_BOOKMARK_TREE },
      (bookmarkTreeNodes) => {
        const formattedTreeNodes = formatTreeNodes(
          bookmarkTreeNodes[0].children
        )
        setDataSource(formattedTreeNodes)
      }
    )
  }

  const handleAccessibleDetectInfo = (info) => {
    setAccessibleDetectInfo((prevState) => {
      return {
        ...prevState,
        ...info
      }
    })
  }

  const detectState = React.useMemo(() => {
    return {
      ...accessibleDetectInfo,
      setAccessibleDetectInfo: handleAccessibleDetectInfo
    }
  }, [accessibleDetectInfo])

  const globalState = React.useMemo(() => {
    return {
      dataSource,
      contextMenuNode,
      checkboxVisible,
      contextMenuPosition
    }
  }, [dataSource, contextMenuNode, checkboxVisible, contextMenuPosition])

  const globalActions = React.useMemo(() => {
    return {
      setCheckboxVisible,
      setContextMenuNode,
      setContextMenuPosition,
      refresh: init
    }
  }, [])

  return (
    <GlobalActionContext.Provider value={globalActions}>
      <AccessibleDetectContext.Provider value={detectState}>
        <GlobalStateContext.Provider value={globalState}>
          <ManageMain dataSource={dataSource} init={init} />
        </GlobalStateContext.Provider>
      </AccessibleDetectContext.Provider>
    </GlobalActionContext.Provider>
  )
}
