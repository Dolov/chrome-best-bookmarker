import classnames from "classnames"
import React from "react"

import useControllableValue from "~/hooks/use-controllable-value"

export interface BubbleProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  trigger?: "click" | "hover"
  onClick?: React.MouseEventHandler<HTMLDivElement>
  /** 子气泡大小 */
  subSize?: number
  /** 子气泡展开半径 */
  subRadius?: number
  className?: string
  startAngle?: number
  /** 子气泡是否可见 */
  subVisible?: boolean
  /** 子气泡默认是否可见 */
  defaultSubVisible?: boolean
  /** 子气泡是否可见的切换 */
  onSubVisibleChange?: (visible: boolean) => void
  subBubbles?: Array<{
    key: string
    name?: string
    render?(angle): React.ReactNode
    color?: string
    shadowColor?: string
  }>
}

const Bubble: React.FC<BubbleProps> = (props) => {
  const {
    style,
    children,
    className,
    subBubbles,
    trigger = "click",
    subSize = 50,
    subRadius = 80,
    onMouseEnter: onMouseEnterProp,
    onMouseLeave: onMouseLeaveProp
  } = props
  const [subVisible, setSubVisible] = useControllableValue(props, {
    trigger: "onSubVisibleChange",
    defaultValue: false,
    valuePropName: "subVisible",
    defaultValuePropName: "defaultSubVisible"
  })
  /** 记录 subVisible 是否变化过，主要是为了隐藏第一次动画 */
  const [subVisibleChanged, setSubVisibleChanged] = React.useState(subVisible)

  React.useEffect(() => {
    if (subVisibleChanged) return
    if (subVisible) {
      setSubVisibleChanged(true)
    }
  }, [subVisible, subVisibleChanged])

  const mergeStyle = React.useMemo(() => {
    return {
      "--offset-size": `-${subSize / 4}px`,
      ...style
    }
  }, [subSize])

  /** 鼠标移入时，如果是吸附状态则展开 */
  const onMouseEnter: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (trigger === "click") return
    if (sub) {
      setSubVisible(!subVisible)
    }
    onMouseEnterProp && onMouseEnterProp(event)
  }

  const onMouseLeave: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (trigger === "click") return
    if (sub) {
      setSubVisible(!subVisible)
    }
    onMouseLeaveProp && onMouseLeaveProp(event)
  }

  const sub = Array.isArray(subBubbles) && subBubbles.length

  const clickHandler: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (trigger === "hover") return
    if (sub) {
      setSubVisible(!subVisible)
    }
    props?.onClick?.(e)
  }

  const bubble = (
    <div
      style={mergeStyle}
      onClick={clickHandler}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={classnames("bubble", className)}>
      {sub && (
        <div
          className={classnames(`bubble-surround`, {
            hidden: !subVisible,
            visible: subVisible,
            animate: subVisibleChanged
          })}>
          {subBubbles.map((item, index) => {
            const { key, name, render, color, shadowColor } = item
            // 计算气泡的位置角度，确保均匀分布
            const angle = (index * 360) / subBubbles.length + 180

            // 计算反向旋转的角度
            const reverseAngle = -angle

            return (
              <div
                key={key}
                style={{
                  "--color": color,
                  "--shadow-color": shadowColor || color,
                  width: subSize,
                  height: subSize,
                  transform: `rotateZ(${angle}deg) translateY(${subRadius}px)`,
                  background: color
                }}
                className={classnames("bubble-sub")}
                onClick={(e) => e.stopPropagation()}>
                {/* 内容部分逆向旋转以保持水平 */}
                <div
                  className="center"
                  style={{
                    transform: `rotateZ(${reverseAngle}deg)` // 反向旋转内容
                  }}>
                  {name || render(angle)}
                </div>
              </div>
            )
          })}
        </div>
      )}
      {children}
    </div>
  )

  return bubble
}

export default Bubble
