import React from 'react';
import { sharedRichTextConfig } from './RichTextConfig';
import { View } from 'react-native';

function applyMarks(value, marks = []) {
  return marks.reduce((renderedValue, mark) => {
    const markRenderer = sharedRichTextConfig?.renderMark?.[mark?.type];
    return markRenderer ? markRenderer(renderedValue) : renderedValue;
  }, value);
}

function renderNode(node, keyPrefix = 'node') {
  if (!node) return null;

  if (node.nodeType === 'text') {
    return <React.Fragment key={keyPrefix}>{applyMarks(node.value || '', node.marks)}</React.Fragment>;
  }

  const renderedChildren = Array.isArray(node.content)
    ? node.content.map((child, index) => renderNode(child, `${keyPrefix}-${index}`))
    : [];

  const nodeRenderer = sharedRichTextConfig?.renderNode?.[node.nodeType];
  const renderedNode = nodeRenderer ? nodeRenderer(node, renderedChildren) : renderedChildren;

  if (Array.isArray(renderedNode)) {
    return (
      <React.Fragment key={keyPrefix}>
        {renderedNode.map((item, index) => (
          <React.Fragment key={`${keyPrefix}-list-${index}`}>{item}</React.Fragment>
        ))}
      </React.Fragment>
    );
  }

  if (React.isValidElement(renderedNode)) {
    return React.cloneElement(renderedNode, { key: keyPrefix });
  }

  return <React.Fragment key={keyPrefix}>{renderedNode}</React.Fragment>;
}

export default function RichText({ json, classNames, refs }) {
  if (!json) return null;

  let parsedJson;

  try {
    parsedJson = typeof json === 'string' ? JSON.parse(json) : json;
  } catch (_error) {
    return null;
  }

  if (!parsedJson || !parsedJson.nodeType || !Array.isArray(parsedJson.content)) {
    return null;
  }

  return <View>{renderNode(parsedJson, 'root')}</View>;
}
