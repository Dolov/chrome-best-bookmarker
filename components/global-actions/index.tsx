import React, { Fragment } from "react"

import ItemContentMenus from "./item-content-menus"

const GlobalActions: React.FC<{
  addKeyword: (keyword: string) => void
}> = (props) => {
  const { addKeyword } = props
  return (
    <Fragment>
      <ItemContentMenus addKeyword={addKeyword} />
    </Fragment>
  )
}

export default GlobalActions
