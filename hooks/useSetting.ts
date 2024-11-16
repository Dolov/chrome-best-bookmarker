import React from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { Storage } from "~/utils"

export const useThemeChange = () => {
  const [settings, setSettings] = useStorage<{
    theme?: string
  }>(Storage.SETTINGS, {
    theme: "light"
  })

  const { theme } = settings

  const setTheme = (theme: string) => {
    setSettings({
      ...settings,
      theme
    })
  }

  React.useEffect(() => {
    if (!theme) return
    const html = document.querySelector("html")
    html.setAttribute("data-theme", theme)
  }, [theme])

  return [theme, setTheme]
}
