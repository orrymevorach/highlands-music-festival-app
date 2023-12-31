import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { sharedRichTextConfig } from './RichTextConfig';
import { View } from 'react-native';

// Documentation for @contentful/rich-text-react-renderer:
// https://www.contentful.com/blog/rich-text-field-tips-and-tricks/
// https://github.com/contentful/rich-text/tree/8b31b855f758fd8f26a041270903eadd6ebe337f/packages/rich-text-react-renderer
// https://www.npmjs.com/package/@contentful/rich-text-react-renderer/v/14.1.2

export default function RichText({ json, classNames, refs }) {
  return <View>{documentToReactComponents(json, sharedRichTextConfig)}</View>;
}
