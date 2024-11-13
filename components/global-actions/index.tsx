import React, { Fragment } from "react"

import { Message } from "~/utils"

import { useGlobalContext } from "../global-provider"
import {
  FileIcon,
  FluentFolderAdd24Filled,
  MaterialSymbolsBookmarkRemove,
  MaterialSymbolsContentCopyRounded,
  MaterialSymbolsDelete,
  MaterialSymbolsDriveFileMoveRounded,
  MdiRename,
  MingcuteSearch2Fill,
  RiDownloadCloud2Fill,
  TinyFolderIcon
} from "../icons"
import ItemContentMenus from "./item-content-menus"

const GlobalActions: React.FC<{}> = (props) => {
  const {} = props
  return (
    <Fragment>
      <ItemContentMenus />
    </Fragment>
  )
}

export default GlobalActions
