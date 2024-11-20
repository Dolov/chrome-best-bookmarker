import React from "react"

/**
 *
 * Hook to track why a component re-renders
 * @param componentName - Name of the component for better debugging
 * @param props - Component props
 */
export function useWhyDidYouUpdate(
  componentName: string,
  props: Record<string, any>
) {
  const previousProps = React.useRef(props)

  React.useEffect(() => {
    if (previousProps.current) {
      const allKeys = new Set([
        ...Object.keys(previousProps.current),
        ...Object.keys(props)
      ])
      const changes: Record<string, { from: any; to: any }> = {}

      allKeys.forEach((key) => {
        if (previousProps.current[key] !== props[key]) {
          changes[key] = {
            from: previousProps.current[key],
            to: props[key]
          }
        }
      })

      if (Object.keys(changes).length > 0) {
        console.log(`[${componentName}] changed props:`, changes)
      } else {
        console.log(`[${componentName}] re-rendered with no prop changes`)
      }
    }

    previousProps.current = props
  })
}
