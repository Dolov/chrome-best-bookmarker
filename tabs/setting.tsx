import classnames from "classnames"
import React from "react"

import { themes } from "~/components/utils"
import { useThemeChange } from "~hooks/use-setting"

import "~/tailwindcss.less"

document.title = `${chrome.i18n.getMessage("extensionName")}`

const ThemeList = (props) => {
  const { value, onChange } = props

  return (
    <div className="rounded-box grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {themes.map((item) => {
        const checked = value === item
        return (
          <div
            onClick={() => onChange(item)}
            key={item}
            className={classnames("overflow-hidden rounded-lg item-border", {
              "item-border-active": checked
            })}>
            <div
              data-theme={item}
              className="bg-base-100 text-base-content w-full cursor-pointer font-sans">
              <div className="grid grid-cols-5 grid-rows-3">
                <div className="bg-base-200 col-start-1 row-span-2 row-start-1"></div>{" "}
                <div className="bg-base-300 col-start-1 row-start-3"></div>
                <div className="bg-base-100 col-span-4 col-start-2 row-span-3 row-start-1 flex flex-col gap-1 p-2">
                  <div className="font-bold">{item}</div>
                  <div
                    className="flex flex-wrap gap-1"
                    data-svelte-h="svelte-1kw79c2">
                    <div className="bg-primary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-primary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-secondary flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-secondary-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-accent flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-accent-content text-sm font-bold">
                        A
                      </div>
                    </div>
                    <div className="bg-neutral flex aspect-square w-5 items-center justify-center rounded lg:w-6">
                      <div className="text-neutral-content text-sm font-bold">
                        A
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export interface SettingProps {}

const Setting: React.FC<SettingProps> = (props) => {
  const {} = props

  const [theme, setTheme] = useThemeChange()

  return (
    <div className="overflow-auto h-full">
      <div className="collapse bg-base-200">
        <input type="radio" name="my-accordion-1" defaultChecked />
        <div className="collapse-title text-xl font-medium">
          {chrome.i18n.getMessage("settings_theme")}
        </div>
        <div className="collapse-content">
          <ThemeList value={theme} onChange={setTheme} />
        </div>
      </div>
    </div>
  )
}

export default Setting
