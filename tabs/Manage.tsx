import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { CaseSensitive, MatchType, Union } from "~/components/SearchCondition"
import SearchInput from "~/components/SearchInput"
import FileTree from "~/components/Tree"
import {
  formattedTreeNodesTitle,
  formatTreeNodes,
  matchSearch
} from "~/components/utils"
import { SearchType, Storage } from "~/utils"

import "~/tailwindcss.css"

const Manage = () => {
  const [dataSource, setDataSource] = React.useState([])
  const [keywords, setKeywords] = React.useState<string[]>([])
  const [union] = useStorage(Storage.UNION, true)
  const [sensitive] = useStorage(Storage.CASE_SENSITIVE, false)
  const [searchType] = useStorage(Storage.SEARCH_TYPE, SearchType.MIXIN)

  React.useEffect(() => {
    init()
  }, [])

  const onChange = (words: string[]) => {
    if (words.join() === keywords.join()) return
    setKeywords(words)
  }

  const init = () => {
    chrome.bookmarks.getTree((bookmarkTreeNodes) => {
      const formattedTreeNodes = formatTreeNodes(bookmarkTreeNodes[0].children)
      setDataSource(formattedTreeNodes)
    })
  }

  const matchedNodes = React.useMemo(() => {
    const options = {
      dataSource
    }
    if (!keywords.length) {
      const jsxNodes = formattedTreeNodesTitle(dataSource, options)
      return jsxNodes
    }

    const matchedNodes = matchSearch(keywords, dataSource, {
      union,
      sensitive,
      searchType
    })

    return formattedTreeNodesTitle(matchedNodes, options)
  }, [keywords, dataSource, sensitive, searchType, union])

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="w-[1000px] flex flex-col">
        <div className="my-4">
          <label className="input input-bordered flex items-center gap-2 rounded-full">
            <SearchInput
              className="flex-1"
              onChange={onChange}
              onPressEnter={init}
              suffix={
                <div className="actions flex">
                  <CaseSensitive />
                  <span className="ml-1">
                    <Union />
                  </span>
                  <span className="ml-1">
                    <MatchType />
                  </span>
                </div>
              }
            />
          </label>
        </div>
        <div className="flex-1 rounded-lg overflow-auto mb-2">
          <FileTree data={matchedNodes} />
        </div>
      </div>
    </div>
  )
}

export default Manage
