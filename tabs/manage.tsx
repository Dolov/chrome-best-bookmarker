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
import {
  SelectContext,
  type SelectContextProps
} from "~components/context/select-provivder"
import ManageMain from "~components/manage-main"
import { useThemeChange } from "~hooks/use-setting"

import "~/tailwindcss.less"

export default () => {
  useThemeChange()
  const [settings, setSettings] = useStorage(Storage.SETTINGS, {
    checkbox: true
  })
  const [checkboxVisible, handleCheckboxVisible] = React.useState(
    settings.checkbox
  )
  const [dataSource, setDataSource] = React.useState([])
  const [selectedIds, setSelectedIds] = React.useState([])
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

  const [contextMenuNode, setContextMenuNode] =
    React.useState<BookmarkProps>(null)

  const [contextMenuPosition, setContextMenuPosition] = React.useState<{
    x: number
    y: number
  }>(null)

  React.useEffect(() => {
    init()
  }, [])

  React.useEffect(() => {
    const always = settings.checkbox
    const visible = selectedIds.length > 0
    handleCheckboxVisible(always || visible)
  }, [selectedIds, settings.checkbox])

  const setCheckboxVisible = (checkboxVisible) => {
    setSettings({
      ...settings,
      checkbox: checkboxVisible
    })
    if (!checkboxVisible) {
      setSelectedIds([])
    }
  }

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
      checkboxVisible,
      contextMenuNode,
      contextMenuPosition
    }
  }, [dataSource, contextMenuNode, contextMenuPosition, checkboxVisible])

  const globalActions = React.useMemo(() => {
    return {
      setContextMenuNode,
      setCheckboxVisible,
      setContextMenuPosition,
      refresh: init
    }
  }, [])

  const selectState = React.useMemo(() => {
    return {
      selectedIds,
      setSelectedIds
    }
  }, [selectedIds])

  return (
    <GlobalActionContext.Provider value={globalActions}>
      <GlobalStateContext.Provider value={globalState}>
        <AccessibleDetectContext.Provider value={detectState}>
          <SelectContext.Provider value={selectState}>
            <ManageMain />
          </SelectContext.Provider>
        </AccessibleDetectContext.Provider>
      </GlobalStateContext.Provider>
    </GlobalActionContext.Provider>
  )
}
