// import styles from './rich-text.module.scss';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';

export const sharedRichTextConfig = {
  renderMark: {
    [MARKS.UNDERLINE]: text => {
      return text;
    },
    [MARKS.BOLD]: text => {
      return <Text>{text}</Text>;
    },
    [MARKS.ITALIC]: text => {
      return <Text>{text}</Text>;
    },
    [MARKS.CODE]: text => {
      return <Text>{text}</Text>;
    },
  },
  renderNode: {
    [INLINES.HYPERLINK]: (node, children) => {
      return <Text style={styles.hyperlink}>{children}</Text>;
    },
    [BLOCKS.EMBEDDED_ENTRY]: node => {
      return null;
    },
    [BLOCKS.PARAGRAPH]: (_node, children) => {
      return <Text style={styles.paragraph}>{children}</Text>;
    },
    [BLOCKS.EMBEDDED_ASSET]: node => {
      return null;
    },
    [BLOCKS.HEADING_1]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_2]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_3]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_4]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_5]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.HEADING_6]: (_node, children) => <Text>{children}</Text>,
    [BLOCKS.UL_LIST]: (_node, children) => {
      return children.map(child => {
        return (
          <View style={styles.listItem}>
            <Text style={styles.bulletPoint}>{'\u2022'}</Text>
            <Text style={styles.listItem}>{child}</Text>
          </View>
        );
      });
    },
    [BLOCKS.OL_LIST]: (_node, children) => {
      return children.map((child, i) => {
        return child;
      });
    },
    [BLOCKS.LIST_ITEM]: (_node, child) => {
      return <View>{child}</View>;
    },
    [BLOCKS.QUOTE]: (_node, child) => {
      return <Text>{child}</Text>;
    },
    [BLOCKS.HR]: (_node, child) => {
      return <Text>{child}</Text>;
    },
  },
};

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 14,
    lineHeight: 20,
  },
  hyperlink: {
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  listItem: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 3,
    paddingEnd: 10,
  },
  bulletPoint: {
    marginTop: 2,
    marginRight: 5,
  },
});
