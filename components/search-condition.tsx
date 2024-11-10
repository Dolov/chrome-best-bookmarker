import classnames from "classnames"
import * as React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Storage } from "~/utils"

import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  MaterialSymbolsMatchCaseRounded,
  PhIntersectThreeFill,
  PhIntersectThreeLight
} from "./iconaf"
import { MatchTypeEnum, searchTypeState } from "./utils"

const Case = () => {
  const [sensitive, setSensitive] = useStorage(Storage.CASE_SENSITIVE, false)
  const title = sensitive ? "区分大小写" : "不区分大小写"
  return (
    <div className="lg:tooltip" data-tip={title}>
      <button
        onClick={() => setSensitive(!sensitive)}
        className={classnames("btn btn-circle btn-sm", {
          "btn-primary": sensitive
        })}>
        <MaterialSymbolsMatchCaseRounded className="text-2xl" />
      </button>
    </div>
  )
}

const Union: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  const [union, setUnion] = useStorage(Storage.UNION, true)
  const title = union ? "并集" : "交集"
  return (
    <div className={classnames("lg:tooltip", className)} data-tip={title}>
      <button
        onClick={() => setUnion(!union)}
        className={classnames("btn btn-circle btn-sm", {
          "btn-secondary": !union
        })}>
        {union && <PhIntersectThreeLight className="text-xl" />}
        {!union && <PhIntersectThreeFill className="text-xl" />}
      </button>
    </div>
  )
}

const MatchType: React.FC<{
  className?: string
}> = (props) => {
  const { className } = props
  const [type, setType] = useStorage<MatchTypeEnum>(
    Storage.SEARCH_TYPE,
    MatchTypeEnum.MIXIN
  )

  const titleMap = {
    [MatchTypeEnum.URL]: "标题匹配",
    [MatchTypeEnum.DIR]: "目录匹配",
    [MatchTypeEnum.MIXIN]: "混合匹配"
  }

  const toggleType = () => {
    const nextType = searchTypeState[type].next()
    setType(nextType)
  }

  return (
    <div
      className={classnames("lg:tooltip", className)}
      data-tip={titleMap[type]}>
      <button
        onClick={toggleType}
        className={classnames("btn btn-circle btn-sm", {
          "btn-accent": type !== MatchTypeEnum.MIXIN
        })}>
        {type === MatchTypeEnum.URL && <AlignLeftOutlined />}
        {type === MatchTypeEnum.DIR && <AlignRightOutlined />}
        {type === MatchTypeEnum.MIXIN && <AlignCenterOutlined />}
      </button>
    </div>
  )
}

export { Union, MatchType, Case }
