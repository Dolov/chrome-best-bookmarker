import { debounce } from "radash"
import { useCallback, useEffect, useState } from "react"

// 自定义钩子：传入 value 和延迟时间，返回防抖后的值
function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  const debouncedFn = useCallback(debounce({ delay: 300 }, setDebouncedValue), [
    delay
  ])

  useEffect(() => {
    debouncedFn(value)
  }, [value])

  return debouncedValue
}

export default useDebouncedValue
