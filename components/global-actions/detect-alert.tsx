import React from "react"

import { formatDuration } from "~utils"

import { AccessibleDetectContext } from "../context/accessible-detect-provider"

const DetectAlert = () => {
  const accessibleDetectInfo = React.useContext(AccessibleDetectContext)

  // if (accessibleDetectInfo.status !== "done") return null
  const { index, startTime, endTime, failIds } = accessibleDetectInfo
  const duration = formatDuration(startTime, endTime)
  return (
    <div className="toast toast-center z-10">
      <div role="alert" className="alert alert-warning">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 shrink-0 stroke-current"
          fill="none"
          viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div>
          <div>
            共检测 {index} 个地址，发现 {failIds.length} 个无法访问，耗时{" "}
            {duration}。
          </div>
          <div>
            由于网络环境或其他因素，检测结果可能不完全准确。请谨慎删除，避免数据丢失。
            [查看详细列表]
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetectAlert
