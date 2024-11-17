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
import {
  GlobalActionContext,
  GlobalStateContext
} from "../context/global-provider"
import { isUrlAccessible } from "../utils"

const FloatButton = () => {
  const [visible, setVisible] = React.useState(false)
  const globalState = React.useContext(GlobalStateContext)
  const accessibleDetectInfo = React.useContext(AccessibleDetectContext)
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
    const setAccessibleDetectInfo =
      accessibleDetectInfoRef.current.setAccessibleDetectInfo
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
          const successIds = accessibleDetectInfo.successIds
          info.successIds = [...successIds, node.id]
        } else {
          const failIds = accessibleDetectInfo.failIds
          info.failIds = [...failIds, node.id]
        }

        setAccessibleDetectInfo(info)
      } else if (children) {
        await detectStart(children)
      }
    }
  }

  const handleDetect = () => {
    detectStart()
  }

  const ToolBoxIcon = visible ? FluentToolbox28Regular : FluentToolbox28Filled

  return (
    <div className="fixed bottom-20 right-36">
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
                <div className="tooltip center p-2">
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
                <div className="tooltip center p-2">
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
                <div className="tooltip center p-2">
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
                <div className="tooltip center p-2">
                  <button
                    onClick={handleDetect}
                    className="btn btn-sm btn-warning btn-circle mx-2">
                    <WhhWebsite className="text-lg text-white animate-spin" />
                  </button>
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
