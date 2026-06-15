import React from 'react';
import { sharedRichTextConfig } from './RichTextConfig';
import { View } from 'react-native';

type RichTextMark = {
  type: string;
};

type RichTextNode = {
  nodeType: string;
  value?: string;
  marks?: RichTextMark[];
  content?: RichTextNode[];
};

type RichTextProps = {
  json: unknown;
};

type MarkRendererMap = Record<
  string,
  (text: React.ReactNode) => React.ReactNode
>;
type NodeRendererMap = Record<
  string,
  (node: RichTextNode, children: React.ReactNode[]) => React.ReactNode
>;

const isRichTextDocument = (value: unknown): value is RichTextNode => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as RichTextNode;
  return Boolean(candidate.nodeType) && Array.isArray(candidate.content);
};

function applyMarks(value: React.ReactNode, marks: RichTextMark[] = []) {
  const markRenderers = sharedRichTextConfig?.renderMark as
    | MarkRendererMap
    | undefined;

  return marks.reduce((renderedValue, mark) => {
    const markRenderer = markRenderers?.[mark?.type];
    return markRenderer ? markRenderer(renderedValue) : renderedValue;
  }, value);
}

function renderNode(
  node: RichTextNode | null | undefined,
  keyPrefix = 'node',
): React.ReactNode {
  if (!node) return null;

  if (node.nodeType === 'text') {
    return (
      <React.Fragment key={keyPrefix}>
        {applyMarks(node.value || '', node.marks)}
      </React.Fragment>
    );
  }

  const renderedChildren: React.ReactNode[] = Array.isArray(node.content)
    ? node.content.map(
        (child: RichTextNode, index: number): React.ReactNode =>
          renderNode(child, `${keyPrefix}-${index}`),
      )
    : [];

  const nodeRenderers = sharedRichTextConfig?.renderNode as
    | NodeRendererMap
    | undefined;
  const nodeRenderer = nodeRenderers?.[node.nodeType];
  const renderedNode: React.ReactNode = nodeRenderer
    ? nodeRenderer(node, renderedChildren)
    : renderedChildren;

  if (Array.isArray(renderedNode)) {
    return (
      <React.Fragment key={keyPrefix}>
        {renderedNode.map((item, index) => (
          <React.Fragment key={`${keyPrefix}-list-${index}`}>
            {item}
          </React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  if (React.isValidElement(renderedNode)) {
    return React.cloneElement(renderedNode, { key: keyPrefix });
  }

  return <React.Fragment key={keyPrefix}>{renderedNode}</React.Fragment>;
}

export default function RichText({ json }: RichTextProps) {
  if (!json) return null;

  let parsedJson: unknown;

  try {
    parsedJson = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (_error) {
    return null;
  }

  if (!isRichTextDocument(parsedJson)) {
    return null;
  }

  return <View>{renderNode(parsedJson, 'root')}</View>;
}
