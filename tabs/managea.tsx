import { debounce } from "radash"
import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import FileTree from "~/components/Tree"
import {
  formattedTreeNodesTitle,
  formatTreeNodes,
  matchSearch,
  MatchTypeEnum
} from "~/components/utils"
import { Message, Storage } from "~/utils"
import GlobalActions from "~components/global-actions"
import GlobalContext from "~components/global-context"
import { WhhSearchfolder } from "~components/iconaf"
import { Case, MatchType, Union } from "~components/search-condition"
import SearchInput from "~components/search-input"

import "~/tailwindcss.css"

const Manage = () => {
  const [dataSource, setDataSource] = React.useState([])
  const [keywords, setKeywords] = React.useState<string[]>([])
  const [union] = useStorage(Storage.UNION, true)
  const [sensitive] = useStorage(Storage.CASE_SENSITIVE, false)
  const [searchType] = useStorage(Storage.SEARCH_TYPE, MatchTypeEnum.MIXIN)

  React.useEffect(() => {
    init()
  }, [])

  const onChange = (words: string[]) => {
    if (words.join() === keywords.join()) return
    setKeywords(words)
  }

  const debounceOnChange = debounce({ delay: 300 }, onChange)

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

  const matchedNodes = React.useMemo(() => {
    const options = {
      init
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
      <GlobalActions />
      <div className="w-[1000px] flex flex-col">
        <div className="mb-4 mt-6">
          <label className="input input-bordered flex items-center gap-2 rounded-full">
            <SearchInput
              className="flex-1"
              onChange={debounceOnChange}
              onPressEnter={init}
              prefix={<WhhSearchfolder className="text-neutral opacity-70" />}
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
        <div className="flex-1 rounded-lg overflow-auto mb-2">
          <FileTree data={matchedNodes} />
        </div>
      </div>
    </div>
  )
}

export default Manage
