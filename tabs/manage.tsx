import { debounce } from "radash"
import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import FileTree from "~/components/tree"
import {
  formattedTreeNodesTitle,
  formatTreeNodes,
  matchSearch,
  MatchTypeEnum
} from "~/components/utils"
import type { BookmarkProps } from "~/components/utils"
import { Message, Storage } from "~/utils"
import GlobalActions from "~components/global-actions"
import {
  GlobalActionContext,
  GlobalStateContext
} from "~components/global-provider"
import { WhhSearchfolder } from "~components/icons"
import { Case, MatchType, Union } from "~components/search-condition"
import SearchInput from "~components/search-input"
import type { SearchInputRefProps } from "~components/search-input"
import { useThemeChange } from "~hooks/use-setting"

import "~/tailwindcss.less"

const Manage: React.FC<{ dataSource: BookmarkProps[]; init: () => void }> = (
  props
) => {
  const { init, dataSource } = props
  const searchInputRef = React.useRef<SearchInputRefProps>(null)
  const [union] = useStorage(Storage.UNION, true)
  const [sensitive] = useStorage(Storage.CASE_SENSITIVE, false)
  const [searchType] = useStorage(Storage.SEARCH_TYPE, MatchTypeEnum.MIXIN)
  const [keywords, setKeywords] = React.useState<string[]>([])
  const [selectedIds, setSelectedIds] = React.useState([])

  const globalState = React.useContext(GlobalStateContext)
  const { contextMenuNode, checkboxVisible } = globalState

  React.useEffect(() => {
    if (!checkboxVisible) {
      setSelectedIds([])
    }
  }, [checkboxVisible])

  const onChange = (words: string[]) => {
    if (words.join() === keywords.join()) return
    setKeywords(words)
  }

  const debounceOnChange = debounce({ delay: 300 }, onChange)

  const matchedNodes = React.useMemo(() => {
    if (!keywords.length) {
      const jsxNodes = formattedTreeNodesTitle(dataSource)
      return jsxNodes
    }

    const matchedNodes = matchSearch(keywords, dataSource, {
      union,
      sensitive,
      searchType
    })

    return formattedTreeNodesTitle(matchedNodes)
  }, [keywords, dataSource, sensitive, searchType, union])

  const addKeyword = (keyword: string) => {
    if (!searchInputRef.current) return
    searchInputRef.current.addKeyword(keyword)
  }

  const visible = matchedNodes.length > 0

  return (
    <div className="h-screen w-screen flex justify-center">
      <GlobalActions addKeyword={addKeyword} />
      <div className="w-[1000px] flex flex-col">
        <div className="mb-4 mt-6">
          <label className="input input-bordered flex items-center gap-2 rounded-full">
            <SearchInput
              ref={searchInputRef}
              className="flex-1"
              onChange={debounceOnChange}
              onPressEnter={init}
              prefix={<WhhSearchfolder className="opacity-70" />}
              suffix={
                <div className="actions flex">
                  <Case />
                  <Union className="ml-1" />
                  <MatchType className="ml-1" />
                </div>
              }
            />
          </label>
        </div>
        <div className="flex-1 rounded-lg overflow-auto mb-2 px-4">
          {visible && (
            <FileTree
              data={matchedNodes}
              checkbox={checkboxVisible}
              activeId={contextMenuNode?.id}
              selectedIds={selectedIds}
              nodeClassName="h-[24px]"
              onCheckboxChange={setSelectedIds}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default () => {
  const [settings] = useStorage(Storage.SETTINGS, {
    checkbox: true
  })
  const [dataSource, setDataSource] = React.useState([])
  const [checkboxVisible, setCheckboxVisible] = React.useState(
    settings.checkbox
  )
  const [contextMenuNode, setContextMenuNode] =
    React.useState<BookmarkProps>(null)
  const [contextMenuPosition, setContextMenuPosition] = React.useState<{
    x: number
    y: number
  }>(null)

  useThemeChange()

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

  const stateValues = React.useMemo(() => {
    return {
      dataSource,
      contextMenuNode,
      checkboxVisible,
      contextMenuPosition
    }
  }, [dataSource, contextMenuNode, checkboxVisible, contextMenuPosition])

  const functionValues = React.useMemo(() => {
    return {
      setCheckboxVisible,
      setContextMenuNode,
      setContextMenuPosition,
      refresh: init
    }
  }, [])

  return (
    <GlobalActionContext.Provider value={functionValues}>
      <GlobalStateContext.Provider value={stateValues}>
        <Manage dataSource={dataSource} init={init} />
      </GlobalStateContext.Provider>
    </GlobalActionContext.Provider>
  )
}
