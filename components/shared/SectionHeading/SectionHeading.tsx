import type { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  useWindowDimensions,
  type StyleProp,
  type TextStyle,
} from 'react-native';
import {
  black,
  blue,
  fontTertiary,
  lightGreen,
  mobile,
  peach,
} from 'utils/style-variables';

type SectionHeadingProps = {
  children: ReactNode;
  element?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  isBlue?: boolean;
  isPeach?: boolean;
  isSmall?: boolean;
  classNames?: StyleProp<TextStyle>;
};

export default function SectionHeading({
  children,
  isBlue = false,
  isPeach = false,
  isSmall = false,
  classNames,
}: SectionHeadingProps) {
  const { width } = useWindowDimensions();
  const isMobile = width <= mobile;

  return (
    <Text
      accessibilityRole='header'
      style={[
        styles.heading,
        isBlue ? styles.blue : null,
        isPeach ? styles.peach : null,
        isSmall ? styles.small : null,
        isMobile ? styles.mobileHeading : null,
        isMobile && isSmall ? styles.mobileSmall : null,
        classNames,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  heading: {
    marginVertical: 20,
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: lightGreen,
    fontFamily: fontTertiary,
    fontSize: 50,
    color: black,
  },
  blue: {
    backgroundColor: blue,
  },
  peach: {
    backgroundColor: peach,
  },
  small: {
    fontSize: 36,
    paddingVertical: 10,
    marginVertical: 15,
  },
  mobileHeading: {
    fontSize: 30,
    paddingVertical: 10,
    marginVertical: 10,
  },
  mobileSmall: {
    fontSize: 24,
  },
});
