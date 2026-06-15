import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  type GestureResponderEvent,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';
import {
  black,
  blue,
  darkBeige,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  fontTertiary,
  gold,
  lightGreen,
  peach,
  white,
} from 'utils/style-variables';

const BORDER_BROWN = '#422800';
const BASE_BG = 'rgba(255, 255, 255, 0.4)';

type ButtonProps = {
  children: ReactNode;
  isLoading?: boolean;
  isDisabled?: boolean;
  href?: string | null;
  handleClick?: ((event: GestureResponderEvent) => void) | null;
  classNames?: StyleProp<ViewStyle>;
  target?: string;
  isSmall?: boolean;
  isDarkBeige?: boolean;
  isGroovy?: boolean;
  isGold?: boolean;
  isBlue?: boolean;
  isGreen?: boolean;
  isDarkGreen?: boolean;
  isDeprecated?: boolean;
  isPeach?: boolean;
};

const openHref = async (href: string) => {
  const supported = await Linking.canOpenURL(href);
  if (supported) {
    await Linking.openURL(href);
  }
};

export default function Button({
  children,
  isLoading = false,
  isDisabled = false,
  href = null,
  handleClick = null,
  classNames,
  target = '',
  isSmall = false,
  isDarkBeige = false,
  isGroovy = false,
  isGold = false,
  isBlue = false,
  isGreen = false,
  isDarkGreen = false,
  isDeprecated = false,
  isPeach = false,
}: ButtonProps) {
  const isButtonDisabled = isDisabled || isLoading;

  const onPress = async (event: GestureResponderEvent) => {
    if (isButtonDisabled) return;

    if (href) {
      await openHref(href);
      return;
    }

    if (handleClick) {
      handleClick(event);
    }
  };

  const buttonStyles: StyleProp<ViewStyle> = [
    styles.button,
    isSmall ? styles.small : null,
    isDarkBeige ? styles.darkBeige : null,
    isGold ? styles.gold : null,
    isBlue ? styles.blue : null,
    isGreen ? styles.green : null,
    isDarkGreen ? styles.darkGreen : null,
    isDeprecated ? styles.deprecated : null,
    isPeach ? styles.peach : null,
    isButtonDisabled ? styles.disabled : null,
    classNames,
  ];

  const textStyles: StyleProp<TextStyle> = [
    styles.text,
    isGroovy ? styles.groovyText : null,
    isDarkGreen || isDeprecated ? styles.lightText : null,
    isSmall ? styles.smallText : null,
    isDeprecated ? styles.deprecatedText : null,
  ];

  const spinnerColor = isDarkGreen || isDeprecated ? white : BORDER_BROWN;

  return (
    <Pressable
      disabled={isButtonDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        buttonStyles,
        pressed && !isDisabled ? styles.pressed : null,
      ]}
      accessibilityRole='button'
      accessibilityState={{ disabled: isButtonDisabled }}
    >
      {isLoading ? (
        <ActivityIndicator size='small' color={spinnerColor} />
      ) : (
        <Text style={textStyles}>{children}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
    backgroundColor: BASE_BG,
    minWidth: 100,
    borderWidth: 2,
    borderColor: BORDER_BROWN,
    borderRadius: 30,
    shadowColor: BORDER_BROWN,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
    paddingHorizontal: 18,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
    shadowOffset: { width: 2, height: 2 },
  },
  text: {
    fontFamily: fontSecondaryBold,
    color: BORDER_BROWN,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  groovyText: {
    fontFamily: fontTertiary,
  },
  lightText: {
    color: white,
  },
  darkBeige: {
    backgroundColor: darkBeige,
  },
  gold: {
    backgroundColor: gold,
  },
  blue: {
    backgroundColor: blue,
  },
  green: {
    backgroundColor: lightGreen,
  },
  darkGreen: {
    backgroundColor: darkGreen,
  },
  peach: {
    backgroundColor: peach,
  },
  small: {
    minWidth: 80,
    minHeight: 40,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallText: {
    fontSize: 16,
  },
  deprecated: {
    backgroundColor: darkGreen,
    borderWidth: 0,
    borderRadius: 10,
    minWidth: 100,
    minHeight: 42,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowOpacity: 0,
    elevation: 0,
  },
  deprecatedText: {
    fontFamily: fontSecondary,
    color: white,
    fontSize: 16,
    lineHeight: 21,
  },
  disabled: {
    opacity: 0.6,
  },
});
