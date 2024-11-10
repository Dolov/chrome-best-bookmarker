import React from "react"

const GlobalActions: React.FC<{}> = (props) => {
  const {} = props
  return (
    <div>
      <ItemContentMenu />
    </div>
  )
}

const ItemContentMenu: React.FC<{}> = () => {
  return (
    <ul
      tabIndex={0}
      className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
      <li>
        <a>重命名</a>
      </li>
      <li>
        <a>删除</a>
      </li>
      <li>
        <a>搜索</a>
      </li>
      <li>
        <a>复制</a>
      </li>
      <li>
        <a>移动</a>
      </li>
    </ul>
  )
}

export default GlobalActions
