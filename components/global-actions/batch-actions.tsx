import React, { useState } from "react"

const ExpandableButtons = () => {
  const [isExpanded, setIsExpanded] = useState(true)

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev)
  }

  return (
    <div className="fixed top-24 right-36 flex flex-col items-center">
      <button
        onClick={toggleExpand}
        className="btn btn-circle btn-neutral btn-sm z-20">
        M
      </button>

      <div
        className={`absolute top-10 flex flex-col items-center space-y-2 transition-all duration-300 ${
          isExpanded ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-10"
        }`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button key={i} className="btn btn-circle btn-neutral btn-sm">
            B
          </button>
        ))}
      </div>
    </div>
  )
}

export default ExpandableButtons
