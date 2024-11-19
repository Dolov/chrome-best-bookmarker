import classnames from "classnames"
import React from "react"

import Bubble from "~/components/bubble"
import {
  FluentToolbox28Filled,
  FluentToolbox28Regular,
  MaterialSymbolsBugReport,
  MaterialSymbolsSettings,
  MingcuteGroup2Fill,
  WhhWebsite
} from "~components/icons"

import { AccessibleDetectContext } from "../context/accessible-detect-provider"
import { GlobalStateContext } from "../context/global-provider"
import { isUrlAccessible } from "../utils"

const FloatButton = () => {
  const globalState = React.useContext(GlobalStateContext)
  const accessibleDetectInfo = React.useContext(AccessibleDetectContext)
  const [visible, setVisible] = React.useState(false)
  const [detectLoading, setDetectLoading] = React.useState(false)
  const setAccessibleDetectInfo = accessibleDetectInfo.setAccessibleDetectInfo
  const accessibleDetectInfoRef =
    React.useRef<typeof accessibleDetectInfo>(null)

  accessibleDetectInfoRef.current = accessibleDetectInfo

  const { dataSource } = globalState
  const handleSetting = () => {
    chrome.tabs.create({ url: "./tabs/setting.html" })
  }

  const handleIssues = () => {
    chrome.tabs.create({
      url: "https://github.com/Dolov/chrome-best-bookmarker/issues"
    })
  }

  const handleCircle = () => {
    chrome.tabs.create({
      url: "./tabs/circle.html"
    })
  }

  const detectStart = async (children = dataSource) => {
    for (const node of children) {
      const { children, url } = node
      if (url) {
        setAccessibleDetectInfo({
          index: accessibleDetectInfoRef.current.index + 1,
          currentNode: node
        })

        const success = await isUrlAccessible(url)
        const info: Partial<typeof accessibleDetectInfo> = {}

        if (success) {
          const successIds = accessibleDetectInfoRef.current.successIds
          info.successIds = [...successIds, node.id]
        } else {
          const failIds = accessibleDetectInfoRef.current.failIds
          info.failIds = [...failIds, node.id]
        }

        setAccessibleDetectInfo(info)
      } else if (children) {
        await detectStart(children)
      }
    }
    return true
  }

  const handleDetect = () => {
    if (detectLoading) {
      const id = accessibleDetectInfoRef.current.currentNode?.id
      const element = document.querySelector(`[data-id=bookmark-${id}]`)
      if (!element) return
      element.scrollIntoView({
        block: "start", // 将元素滚动到容器的顶部
        behavior: "smooth" // 平滑滚动
      })
      return
    }

    setDetectLoading(true)
    setAccessibleDetectInfo({
      index: 0,
      status: "loading",
      failIds: [],
      successIds: [],
      startTime: Date.now(),
      endTime: null
    })
    detectStart().finally(() => {
      setDetectLoading(false)
      setAccessibleDetectInfo({
        status: "done",
        endTime: Date.now(),
        currentNode: null
      })
    })
  }

  const ToolBoxIcon = visible ? FluentToolbox28Regular : FluentToolbox28Filled

  const accessibleDetectIdle = accessibleDetectInfo.status === "idle"
  const accessibleDetectDone = accessibleDetectInfo.status === "done"

  return (
    <div className="fixed bottom-24 right-36">
      <Bubble
        subSize={40}
        subRadius={50}
        subVisible={visible}
        onSubVisibleChange={setVisible}
        subBubbles={[
          {
            key: "circle",
            shadowColor: "oklch(var(--in))",
            render(angle) {
              return (
                <div data-tip="圈子" className="tooltip center p-2">
                  <button
                    onClick={handleCircle}
                    className="btn btn-sm btn-info btn-circle mx-2">
                    <MingcuteGroup2Fill className="text-lg text-white" />
                  </button>
                </div>
              )
            }
          },
          {
            key: "setting",
            shadowColor: "oklch(var(--a))",
            render(angle) {
              return (
                <div data-tip="设置" className="tooltip center p-2">
                  <button
                    onClick={handleSetting}
                    className="btn btn-sm btn-accent btn-circle mx-2">
                    <MaterialSymbolsSettings className="text-lg text-white" />
                  </button>
                </div>
              )
            }
          },
          {
            key: "issue",
            shadowColor: "oklch(var(--s))",
            render(angle) {
              return (
                <div
                  data-tip="Bug & 功能报告"
                  className="tooltip tooltip-bottom p-2">
                  <button
                    onClick={handleIssues}
                    className="btn btn-sm btn-secondary btn-circle mx-2">
                    <MaterialSymbolsBugReport className="text-lg text-white" />
                  </button>
                </div>
              )
            }
          },

          {
            key: "accessible-detection",
            shadowColor: "oklch(var(--wa))",
            render(angle) {
              return (
                <div data-tip="失效站点检测" className="tooltip center p-2">
                  <div className="indicator">
                    {!accessibleDetectIdle && (
                      <span className="indicator-item badge badge-warning text-white">
                        {accessibleDetectInfo.failIds.length}
                      </span>
                    )}
                    <button
                      onClick={handleDetect}
                      className="btn btn-sm btn-warning btn-circle mx-2">
                      <WhhWebsite
                        className={classnames("text-lg text-white", {
                          "animate-spin": detectLoading
                        })}
                      />
                    </button>
                  </div>
                </div>
              )
            }
          }
        ]}>
        <button className="btn btn-circle btn-neutral btn-sm">
          <ToolBoxIcon className="text-xl" />
        </button>
      </Bubble>
    </div>
  )
}

export default FloatButton
