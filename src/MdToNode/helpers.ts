import { INode } from 'react-digraph'
import { Node, NodeProps, EdgeProps, Edge } from '../types'

/**
 * get markdown raw text to Node object
 * @param {string} domText - markdown raw text
 * @param {string} nodeTags - tags for markdown html tag
 */

/**
 * build dom tree by DOMParser => selectAll specific tags
 * @param domText raw dom string
 * @param nodeTag tag in dom string
 */
function createDomNodeByText(domText: string, nodeTag: string) {
	const parser = new DOMParser()
	const domTree = parser
		.parseFromString(domText, 'text/html')
		.querySelector('body')

	const allNodeTag = domTree.querySelectorAll(nodeTag)

	return Array.from(allNodeTag)
}

export function getTextNode<T>(
	raw: string,
	nodeTag: string,
	props: NodeProps<T>
): Node<T>[] {
	return createDomNodeByText(raw, nodeTag).map((node) => {
		// format will be ["", "id", "textContent"]
		const tokens = node.textContent.split(/[\[|\]]/g)
		const id = tokens[1] ?? ''
		const textContent = tokens[2]?.trim() ?? ''
		return {
			id,
			type: node.tagName,
			textContent,
			props
		}
	})
}

export function getTextEdge<T>(
	raw: string,
	nodeTag: string,
	props: EdgeProps<T>,
	nodesMap: Map<string, INode>
): Edge<T>[] {
	return createDomNodeByText(raw, nodeTag).map((node) => {
		const [key] = node.textContent.split(' ')
		const [source = '', target = ''] = key.split(':')
		return {
			source: nodesMap.get(source)?.id ?? '',
			target: nodesMap.get(target)?.id ?? '',
			type: node.tagName,
			textContent: node.textContent.split(key).join(''),
			props
		}
	})
}

export function filteredIllegalText(str: string) {
	return (str.match(/\w|-+/g) || []).join('')
}
