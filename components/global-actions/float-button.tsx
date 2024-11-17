import React from "react"

import Bubble from "~/components/bubble"
import {
  MaterialSymbolsBugReport,
  MaterialSymbolsSettings,
  MingcuteGroup2Fill
} from "~components/icons"

const FloatButton = () => {
  const handleSetting = () => {
    chrome.tabs.create({ url: "./tabs/setting.html" })
  }

  return (
    <div className="fixed bottom-20 right-40">
      <Bubble
        subSize={30}
        subRadius={50}
        subBubbles={[
          {
            key: "setting",
            shadowColor: "oklch(var(--s))",
            render(angle) {
              return (
                <div className="tooltip center p-2">
                  <button className="btn btn-xs btn-secondary btn-circle mx-2">
                    <MaterialSymbolsBugReport className="text-lg" />
                  </button>
                </div>
              )
            }
          },
          {
            key: "usable-check",
            shadowColor: "oklch(var(--a))",
            render(angle) {
              return (
                <div className="tooltip center p-2">
                  <button
                    onClick={handleSetting}
                    className="btn btn-xs btn-accent btn-circle mx-2">
                    <MaterialSymbolsSettings className="text-lg" />
                  </button>
                </div>
              )
            }
          },
          {
            key: "square",
            shadowColor: "oklch(var(--in))",
            render(angle) {
              return (
                <div className="tooltip center p-2">
                  <button className="btn btn-xs btn-info btn-circle mx-2">
                    <MingcuteGroup2Fill className="text-lg" />
                  </button>
                </div>
              )
            }
          }
        ]}>
        <button className="btn btn-circle btn-sm">123</button>
      </Bubble>
    </div>
  )
}

export default FloatButton
