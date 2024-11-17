export enum Storage {
  UNION = "UNION",
  SEARCH_TYPE = "SEARCH_TYPE",
  LAST_PARENT_ID = "LAST_PARENT_ID",
  CASE_SENSITIVE = "CASE_SENSITIVE",

  SETTINGS = "SETTINGS"
}

export enum Message {
  ICON_CLICK = "ICON_CLICK",
  SHORTCUT_COMMAND = "SHORTCUT_COMMAND",
  GET_BOOKMARK_TREE = "GET_BOOKMARK_TREE",
  CREATE_BOOKMARK = "CREATE_BOOKMARK",
  UPDATE_BOOKMARK = "UPDATE_BOOKMARK",
  MOVE_BOOKMARK = "MOVE_BOOKMARK",
  REMOVE_BOOKMARK = "REMOVE_BOOKMARK",
  REMOVE_BOOKMARK_TREE = "REMOVE_BOOKMARK_TREE"
}

export const formatDuration = (startTime, endTime) => {
  // 获取时间差（毫秒）
  const diffMilliseconds = endTime - startTime

  // 计算秒、分钟、小时、天数
  const seconds = Math.floor(diffMilliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  // 根据不同的时长来返回合适的格式
  if (seconds < 60) {
    return `${seconds}秒`
  }
  if (minutes < 60) {
    return `${minutes}分钟`
  }
  if (hours < 24) {
    return `${hours}小时 ${minutes % 60}分钟` // 显示小时和分钟
  }
  return `${days}天 ${hours % 24}小时` // 显示天数和小时
}
