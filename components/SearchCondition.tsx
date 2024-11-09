import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { SearchType as SearchTypeEnum, Storage } from "~/utils"

import { searchTypeState } from "./utils"

const CaseSensitive = () => {
  const [sensitive, setSensitive] = useStorage(Storage.CASE_SENSITIVE, false)
  const title = sensitive ? "区分大小写" : "不区分大小写"
  return (
    <div className="lg:tooltip" data-tip="hello">
      <button className="btn">Hover me</button>
    </div>
    // <Tooltip zIndex={baseZIndex} title={title}>
    //   <Button
    //     type="text"
    //     className={`text-slate-500 ${sensitive ? "bg-slate-200" : ""} hover:!bg-slate-200`}
    //     shape="circle"
    //     onClick={() => setSensitive(!sensitive)}
    //   >
    //     Aa
    //   </Button>
    // </Tooltip>
  )
}

const Union = () => {
  const [union, setUnion] = useStorage(Storage.UNION, true)
  const title = union ? "并集" : "交集"
  return (
    <div className="lg:tooltip" data-tip="hello">
      <button className="btn">Hover me</button>
    </div>
    // <Tooltip zIndex={baseZIndex} title={title}>
    //   <Button
    //     type="text"
    //     className={`text-slate-500 flex items-center justify-center ${!union ? "bg-slate-200" : ""} hover:!bg-slate-200`}
    //     shape="circle"
    //     onClick={() => setUnion(!union)}>
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       fill="currentColor"
    //       viewBox="0 0 20 14"
    //       height="1em"
    //       width="1em">
    //       <path d="M7 14A7 7 0 1 1 10 .674a7 7 0 1 1 0 12.653A6.973 6.973 0 0 1 7 14ZM7 2a5 5 0 1 0 1 9.9A6.977 6.977 0 0 1 6 7a6.98 6.98 0 0 1 2-4.9A5.023 5.023 0 0 0 7 2Zm7 5a6.977 6.977 0 0 1-2 4.9 5 5 0 1 0 0-9.8A6.977 6.977 0 0 1 14 7Z" />
    //     </svg>
    //   </Button>
    // </Tooltip>
  )
}

const MatchType = () => {
  const [type, setType] = useStorage<SearchTypeEnum>(
    Storage.SEARCH_TYPE,
    SearchTypeEnum.MIXIN
  )

  const titleMap = {
    [SearchTypeEnum.URL]: "标题匹配",
    [SearchTypeEnum.DIR]: "目录匹配",
    [SearchTypeEnum.MIXIN]: "混合匹配"
  }

  const toggleType = () => {
    // const nextType = searchTypeState[type].next()
    // setType(nextType)
  }

  return (
    <div className="lg:tooltip" data-tip="hello">
      <button className="btn">Hover me</button>
    </div>
    // <Tooltip zIndex={baseZIndex} title={titleMap[type]}>
    //   <Button
    //     type="text"
    //     className="text-slate-500 bg-slate-200 hover:!bg-slate-200"
    //     shape="circle"
    //     onClick={toggleType}>
    //     {type === SearchTypeEnum.URL && <AlignLeftOutlined />}
    //     {type === SearchTypeEnum.DIR && <AlignRightOutlined />}
    //     {type === SearchTypeEnum.MIXIN && <AlignCenterOutlined />}
    //   </Button>
    // </Tooltip>
  )
}

export { Union, MatchType, CaseSensitive }
