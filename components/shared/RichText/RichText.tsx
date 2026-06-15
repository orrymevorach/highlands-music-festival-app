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
  config?: RichTextRenderConfig;
};

type MarkRendererMap = Record<
  string,
  (text: React.ReactNode) => React.ReactNode
>;
type NodeRendererMap = Record<
  string,
  (node: RichTextNode, children: React.ReactNode[]) => React.ReactNode
>;

type RichTextRenderConfig = {
  renderMark?: MarkRendererMap;
  renderNode?: NodeRendererMap;
  renderText?: (text: string) => React.ReactNode;
};

const isRichTextDocument = (value: unknown): value is RichTextNode => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as RichTextNode;
  return Boolean(candidate.nodeType) && Array.isArray(candidate.content);
};

function applyMarks(
  value: React.ReactNode,
  marks: RichTextMark[] = [],
  markRenderers?: MarkRendererMap,
) {
  return marks.reduce((renderedValue, mark) => {
    const markRenderer = markRenderers?.[mark?.type];
    return markRenderer ? markRenderer(renderedValue) : renderedValue;
  }, value);
}

function renderNode(
  node: RichTextNode | null | undefined,
  config: RichTextRenderConfig,
  keyPrefix = 'node',
): React.ReactNode {
  if (!node) return null;

  if (node.nodeType === 'text') {
    const renderedText = config.renderText
      ? config.renderText(node.value || '')
      : node.value || '';

    return (
      <React.Fragment key={keyPrefix}>
        {applyMarks(renderedText, node.marks, config.renderMark)}
      </React.Fragment>
    );
  }

  const renderedChildren: React.ReactNode[] = Array.isArray(node.content)
    ? node.content.map(
        (child: RichTextNode, index: number): React.ReactNode =>
          renderNode(child, config, `${keyPrefix}-${index}`),
      )
    : [];

  const nodeRenderer = config.renderNode?.[node.nodeType];
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

export default function RichText({ json, config }: RichTextProps) {
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

  const mergedConfig: RichTextRenderConfig = {
    renderMark: {
      ...(sharedRichTextConfig?.renderMark as MarkRendererMap),
      ...(config?.renderMark || {}),
    },
    renderNode: {
      ...(sharedRichTextConfig?.renderNode as NodeRendererMap),
      ...(config?.renderNode || {}),
    },
    renderText: config?.renderText,
  };

  return <View>{renderNode(parsedJson, mergedConfig, 'root')}</View>;
}
