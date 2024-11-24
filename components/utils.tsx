import * as React from "react"

import TreeNodeTitleContainer from "./title-container"

export enum MatchTypeEnum {
  URL = "URL",
  DIR = "DIR",
  MIXIN = "MIXIN"
}

export interface BookmarkProps {
  id: string
  title: string
  originalTitle: string
  url?: string
  children?: BookmarkProps[]
}

export const searchTypeState = {
  [MatchTypeEnum.URL]: {
    next() {
      return MatchTypeEnum.DIR
    }
  },
  [MatchTypeEnum.DIR]: {
    next() {
      return MatchTypeEnum.MIXIN
    }
  },
  [MatchTypeEnum.MIXIN]: {
    next() {
      return MatchTypeEnum.URL
    }
  }
}

export const formatTreeNodes = (treeNodes = []) => {
  return treeNodes.reduce((currentValue, item) => {
    const { children = [] } = item
    currentValue.push({
      ...item,
      originalTitle: item.title,
      children: formatTreeNodes(children)
    })
    return currentValue
  }, [])
}

export const formattedTreeNodesTitle = (treeNodes = []) => {
  return treeNodes.reduce((currentValue, item) => {
    const { children = [], url, title } = item
    let titleJsx = title
    if (url) {
      titleJsx = (
        <a
          key={item.id}
          href={url}
          title={title}
          target="_blank"
          className="link link-hover pr-4">
          {title}
        </a>
      )
    }
    currentValue.push({
      ...item,
      title: (
        <TreeNodeTitleContainer key={item.id} node={item}>
          {titleJsx}
        </TreeNodeTitleContainer>
      ),
      children: formattedTreeNodesTitle(children)
    })
    return currentValue
  }, [])
}

export const matchSearch = (keywords: string[], treeNode, options) => {
  const { sensitive, parentMatched, searchType, union, editingBookmark } =
    options
  const result = []

  // Helper function to push matching node to result
  const pushToResult = (itemNode, text, matchedChildren) => {
    result.push({
      ...itemNode,
      title: <span dangerouslySetInnerHTML={{ __html: text }} />,
      children: matchedChildren
    })
  }

  // Iterate over each node in the tree
  for (let index = 0; index < treeNode.length; index++) {
    const itemNode = treeNode[index]
    const { url, children = [] } = itemNode
    const originalTitle = itemNode.originalTitle

    if (!originalTitle) continue // Skip if there's no title

    const lTitle = sensitive ? originalTitle : originalTitle.toLowerCase()
    let matched = false

    // Match keywords using the union or intersection rule
    if (union) {
      matched = keywords.some((keyword) =>
        lTitle.includes(keyword.toLowerCase())
      )
    } else {
      matched = keywords.every((keyword) =>
        lTitle.includes(keyword.toLowerCase())
      )
    }

    // Recursively match children nodes
    const matchedChildren = matchSearch(keywords, children, {
      ...options,
      parentMatched: parentMatched || matched
    })

    // Push current node if it matches
    const text = highlightText(originalTitle, keywords, sensitive) // Get highlighted title
    if (searchType === MatchTypeEnum.URL) {
      if (matched || matchedChildren.length) {
        pushToResult(itemNode, text, matchedChildren)
        continue
      }
    }

    if (searchType === MatchTypeEnum.DIR) {
      if (
        (url && parentMatched) ||
        (!url && (matched || parentMatched || matchedChildren.length))
      ) {
        pushToResult(itemNode, text, matchedChildren)
        continue
      }
    }

    if (searchType === MatchTypeEnum.MIXIN) {
      if (matched || matchedChildren.length || parentMatched) {
        pushToResult(itemNode, text, matchedChildren)
        continue
      }
    }

    // Always include the currently editing bookmark node
    if (editingBookmark?.id === itemNode?.id) {
      pushToResult(itemNode, text, matchedChildren)
      continue
    }
  }

  return result
}

export function highlightText(
  inputText: string,
  keywords: string[],
  sensitive = false
) {
  if (!inputText || keywords.length === 0) {
    return inputText
  }

  // Escape special characters in keywords to prevent them from being interpreted as regex metacharacters
  const escapedKeywords = keywords.map(
    (keyword) => keyword.replace(/[.*+?^=!:${}()|\[\]\/\\]/g, "\\$&") // Escape special characters
  )

  const i = sensitive ? "" : "i" // Case-sensitive flag
  const regex = new RegExp(escapedKeywords.join("|"), `g${i}`) // Build the regex with the escaped keywords

  let index = 0 // Used for generating unique class names
  // Replace matched keywords with highlighted spans
  return inputText.replace(regex, (substring) => {
    index += 1 // Increment index for unique class
    return `<span class="highlight highlight-${index}">${substring}</span>` // Highlight matched text
  })
}

/**
 * Copies the given text to the clipboard.
 *
 * @param {string} text - The text to be copied.
 * @return {void} This function does not return anything.
 */
export const copyTextToClipboard = (text: string) => {
  const textArea = document.createElement("textarea")
  textArea.value = text
  document.body.appendChild(textArea)
  textArea.select()

  try {
    document.execCommand("copy")
  } catch (err) {
    console.log("copy err: ", err)
  }
  document.body.removeChild(textArea)
}

export const getBookmarksToText = (children = []) => {
  return children.reduce((text, item) => {
    const { url, originalTitle } = item
    if (url) {
      return `${text}\n\n${originalTitle}\n${url}`
    }
    const childrenText = getBookmarksToText(item.children)
    return `${text}\n\n${childrenText}`
  }, "")
}

export const getDirectories = (treeData = [], excludeChildrenNodeId = "") => {
  return treeData.reduce((currentValue, item) => {
    if (!item) return currentValue

    const { children = [], url, id } = item

    // 过滤掉含有 url 的节点
    if (url) return currentValue

    // 如果当前节点的 id 匹配排除条件，直接跳过
    if (excludeChildrenNodeId === id) {
      return currentValue
    }

    // 对 children 进行递归操作，确保不修改原始数据
    const newChildren = getDirectories(children, excludeChildrenNodeId)

    // 创建新的 item 对象，避免修改原始 item
    currentValue.push({ ...item, children: newChildren })

    return currentValue
  }, [])
}

export const matchTreeData = (treeData = [], keyword: string) => {
  return treeData.reduce((currentValue, item) => {
    const { children = [], title } = item
    const ltitle = title?.toLowerCase?.() || ""
    const lkeyword = keyword?.toLowerCase?.() || ""

    // 如果当前项的标题包含关键字，或者它的子树包含匹配项
    if (
      ltitle.includes(lkeyword) ||
      children.some((child) => matchTreeData([child], keyword).length > 0)
    ) {
      // 递归匹配子节点，并保留子节点
      const matchedChildren = matchTreeData(children, keyword)
      currentValue.push({
        ...item,
        children: matchedChildren // 保留匹配的子树
      })
    }

    return currentValue
  }, [])
}

const getBookmarkAsHtml = (
  children: BookmarkProps[],
  parentTitle = "",
  level = 1
) => {
  const n = level > 6 ? 6 : level
  let html = ""

  // 生成顶级标题
  if (parentTitle) {
    html += `<H${n}>${parentTitle}</H${n}>\n`
  }

  html += `<DL><p>\n` // 使用 <DL> 标签来表示书签列表

  children.forEach((child) => {
    // 如果书签有 URL，生成一个 <DT> 和 <A> 标签
    if (child.url) {
      const addDate = Math.floor(Date.now() / 1000) // 当前时间戳
      html += `<DT><A HREF="${child.url}" ADD_DATE="${addDate}" LAST_MODIFIED="${addDate}">${child.originalTitle}</A>\n`
      return
    }

    // 如果书签有子项，递归调用该函数
    if (child.children) {
      html += getBookmarkAsHtml(child.children, child.originalTitle, level + 1)
    }
  })

  html += `</DL><p>\n` // 关闭 <DL> 标签
  return html
}

export const downloadBookmarkAsHtml = (
  children: BookmarkProps[],
  title = "书签"
) => {
  const downloadLink = document.createElement("a")
  const html = getBookmarkAsHtml(children)
  downloadLink.setAttribute(
    "href",
    "data:text/html;charset=utf-8," + encodeURIComponent(html)
  )
  downloadLink.setAttribute("download", `${title}.html`)
  downloadLink.click()
}

export async function isUrlAccessible(url: string): Promise<boolean> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 500)

  try {
    const response = await fetch(url, {
      method: "HEAD",
      cache: "no-cache",
      signal: controller.signal // 将AbortController信号传递给fetch请求
    })

    if (response.ok) {
      return true // 如果响应成功，返回true
    }
    return false // 如果响应失败，返回false
  } catch (error) {
    // 处理fetch请求的超时错误
    if (error.name === "AbortError") {
      console.log("Request timed out")
    }
    return false // 如果发生错误（包括超时），返回false
  } finally {
    clearTimeout(timeoutId) // 清除定时器
  }
}

export const themes = [
  "light",
  "dark",
  "cupcake",
  "bumblebee",
  "emerald",
  "corporate",
  "synthwave",
  "retro",
  "cyberpunk",
  "valentine",
  "halloween",
  "garden",
  "forest",
  "aqua",
  "lofi",
  "pastel",
  "fantasy",
  "wireframe",
  "black",
  "luxury",
  "dracula",
  "cmyk",
  "autumn",
  "business",
  "acid",
  "lemonade",
  "night",
  "coffee",
  "winter",
  "dim",
  "nord",
  "sunset"
]

export const findNodeById = (nodes, id) => {
  for (let node of nodes) {
    if (node.id === id) {
      return node
    }
    if (node.children) {
      const childNode = findNodeById(node.children, id)
      if (childNode) return childNode
    }
  }
  return null
}

// 递归获取子节点的id
export const getChildrenIds = (node) => {
  const ids = []
  if (node.children) {
    for (let child of node.children) {
      ids.push(child.id)
      ids.push(...getChildrenIds(child))
    }
  }
  return ids
}
