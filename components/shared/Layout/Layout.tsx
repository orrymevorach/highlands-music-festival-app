import type { ReactNode } from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { beige, darkGreen } from 'utils/style-variables';
import logo from '../../../assets/Logo-No-Bkgd-min.png';

type LayoutProps = {
  children: ReactNode;
  scroll?: boolean;
  paddingHorizontal?: number;
  center?: boolean;
  backgroundColor?: string;
  headerTitle?: string;
  showHeader?: boolean;
};

export default function Layout({
  children,
  scroll = false,
  paddingHorizontal = 20,
  center = false,
  backgroundColor = beige,
  headerTitle = 'Highlands Music Festival',
  showHeader = false,
}: LayoutProps) {
  const rootStyles = [styles.root, { backgroundColor }];
  const shouldRenderHeader = showHeader || Boolean(headerTitle);

  const header = shouldRenderHeader ? (
    <View style={[styles.header, { paddingHorizontal }]}>
      <Image source={logo} style={styles.logo} resizeMode='contain' />
    </View>
  ) : null;

  if (scroll) {
    return (
      <SafeAreaView style={rootStyles}>
        {header}
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingHorizontal }]}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={rootStyles}>
      {header}
      <View
        style={[
          styles.content,
          { paddingHorizontal },
          center ? styles.center : null,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 32,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    color: darkGreen,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
  },
});
