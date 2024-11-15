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
          className="link link-hover">
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
