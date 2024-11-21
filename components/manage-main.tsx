import { debounce } from "radash"
import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import {
  formattedTreeNodesTitle,
  matchSearch,
  MatchTypeEnum
} from "~/components/utils"
import { Storage } from "~/utils"
import {
  GlobalActionContext,
  GlobalStateContext
} from "~components/context/global-provider"
import { SelectContext } from "~components/context/select-provivder"
import GlobalActions from "~components/global-actions"
import { WhhSearchfolder } from "~components/icons"
import { Case, MatchType, Union } from "~components/search-condition"
import SearchInput from "~components/search-input"
import type { SearchInputRefProps } from "~components/search-input"
import FileTree from "~components/tree"

const ManageMain: React.FC<{}> = (props) => {
  const searchInputRef = React.useRef<SearchInputRefProps>(null)
  const [union] = useStorage(Storage.UNION, true)
  const [sensitive] = useStorage(Storage.CASE_SENSITIVE, false)
  const [searchType] = useStorage(Storage.SEARCH_TYPE, MatchTypeEnum.MIXIN)
  const [keywords, setKeywords] = React.useState<string[]>([])

  const selectState = React.useContext(SelectContext)
  const globalState = React.useContext(GlobalStateContext)
  const globalActions = React.useContext(GlobalActionContext)
  const { contextMenuNode, checkboxVisible, dataSource } = globalState

  const { selectedIds, setSelectedIds } = selectState

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
              onPressEnter={globalActions.refresh}
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
        <div
          id="bookmarks-container"
          className="flex-1 rounded-lg overflow-auto mb-2 px-4">
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

export default React.memo(ManageMain)
