import { useNavigation } from '@react-navigation/native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  black,
  blue,
  fontSecondaryBold,
  gold,
  darkYellow,
} from 'utils/style-variables';

const NAV_BUTTONS = [
  {
    label: 'Announcements',
    route: 'Announcements',
    icon: 'megaphone-outline',
    color: blue,
  },
  {
    label: 'Lineup',
    route: 'Lineup',
    icon: 'musical-notes-outline',
    color: gold,
  },
  {
    label: 'FAQ',
    route: 'FAQ',
    icon: 'help-circle-outline',
    color: darkYellow,
  },
] as const;

export default function QuickNavButtons() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.row}>
      {NAV_BUTTONS.map(({ label, route, icon, color }) => (
        <Pressable
          key={route}
          style={styles.buttonWrapper}
          onPress={() => navigation.navigate(route)}
        >
          {({ pressed }) => (
            <>
              <View
                style={[
                  styles.background,
                  { backgroundColor: color },
                  pressed && styles.backgroundPressed,
                ]}
              />
              <View style={[styles.content, pressed && styles.contentPressed]}>
                <Ionicons name={icon} size={32} color={black} />
                <Text style={styles.label}>{label}</Text>
              </View>
            </>
          )}
        </Pressable>
      ))}
    </View>
  );
}

const BORDER_BROWN = '#422800';

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonWrapper: {
    flex: 1,
    aspectRatio: 1,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: BORDER_BROWN,
    shadowColor: BORDER_BROWN,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  backgroundPressed: {
    shadowOffset: { width: 2, height: 2 },
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    transform: [{ translateX: 0 }, { translateY: 0 }],
  },
  contentPressed: {
    transform: [{ translateX: 2 }, { translateY: 2 }],
  },
  label: {
    fontFamily: fontSecondaryBold,
    fontSize: 14,
    color: black,
    textAlign: 'center',
  },
});
