import React from "react"

export interface Options<T> {
  trigger?: string
  defaultValue?: T
  valuePropName?: string
  defaultValuePropName?: string
}

export interface Props {
  [key: string]: any
}

function useControllableValue<T>(props: Props = {}, options: Options<T> = {}) {
  const {
    defaultValue: innerDefaultValue,
    trigger = "onChange",
    valuePropName = "value",
    defaultValuePropName = "defaultValue"
  } = options

  /** 目标状态值 */
  const value = props[valuePropName] as T

  /** 目标状态默认值 */
  const defaultValue = (props[defaultValuePropName] as T) ?? innerDefaultValue

  /** 初始化内部状态 */
  const [innerValue, setInnerValue] = React.useState<T | undefined>(() => {
    /** 优先取 props 中的目标状态值 */
    if (value !== undefined) {
      return value
    }
    /** 其次取 defaultValue */
    if (defaultValue !== undefined) {
      if (typeof defaultValue === "function") {
        return defaultValue()
      }
      return defaultValue
    }
    return undefined
  })

  /** 优先使用外部状态值，其实使用内部状态值 */
  const mergedValue = value !== undefined ? value : innerValue

  const triggerChange = (newValue: T, ...args: any[]) => {
    setInnerValue(newValue)
    if (
      mergedValue !== newValue &&
      /** 目标状态回调函数，props[trigger] 可以避免 this 丢失 */
      typeof props[trigger] === "function"
    ) {
      props[trigger](newValue, ...args)
    }
  }

  /**
   * 同步非第一次的外部 undefined 状态至内部
   */
  const firstRenderRef = React.useRef(true)
  React.useEffect(() => {
    if (firstRenderRef.current) {
      firstRenderRef.current = false
      return
    }

    if (value === undefined) {
      setInnerValue(value)
    }
  }, [value])

  return [mergedValue, triggerChange] as const
}

export default useControllableValue
