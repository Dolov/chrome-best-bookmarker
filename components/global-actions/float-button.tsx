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

const FloatButton = () => {
  const [visible, setVisible] = React.useState(false)
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

  const handleDetect = () => {}

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
            key: "access-detect",
            shadowColor: "oklch(var(--wa))",
            render(angle) {
              return (
                <div className="tooltip center p-2">
                  <button
                    onClick={handleDetect}
                    className="btn btn-sm btn-warning btn-circle mx-2">
                    <WhhWebsite className="text-lg text-white" />
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
