import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

const BORDER_BROWN = '#422800';

type GroovyCardProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  backgroundColor?: string;
  borderRadius?: number;
};

// wraps content in a "groovy" hard-edged shadow card without letting the
// shadow rasterize the text/icon children inside it (a common RN artifact
// when shadowOpacity/shadowRadius are combined with non-opaque child content)
export default function GroovyCard({
  children,
  style,
  contentStyle,
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  borderRadius = 12,
}: GroovyCardProps) {
  return (
    <View style={[styles.outer, style]}>
      <View style={[styles.background, { backgroundColor, borderRadius }]} />
      <View style={[styles.content, { borderRadius }, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: BORDER_BROWN,
    shadowColor: BORDER_BROWN,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  content: {
    overflow: 'hidden',
  },
});
