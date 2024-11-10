import * as React from "react"

export enum MatchTypeEnum {
  URL = "URL",
  DIR = "DIR",
  MIXIN = "MIXIN"
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

export const formattedTreeNodesTitle = (treeNodes = [], options) => {
  return treeNodes.reduce((currentValue, item) => {
    const { children = [], url, title } = item
    let titleJsx = title
    if (url) {
      titleJsx = (
        <a href={url} title={title} target="_blank" className="link link-hover">
          {title}
        </a>
      )
    }
    currentValue.push({
      ...item,
      // title: (
      //   <TreeNodeTitleContainer node={item} {...options}>
      //     {titleJsx}
      //   </TreeNodeTitleContainer>
      // ),
      title: titleJsx,
      children: formattedTreeNodesTitle(children, options)
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
