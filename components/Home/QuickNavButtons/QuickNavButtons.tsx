import { useNavigation } from '@react-navigation/native';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, type AuthUser } from 'context/AuthContext';
import {
  black,
  blue,
  fontSecondaryBold,
  gold,
  peach,
  orange,
} from 'utils/style-variables';

const CHECK_IN_URL = 'https://reservations.highlandsmusicfestival.ca/check-in';

type NavButton = {
  label: string;
  route: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  url?: string;
};

const getNavButtons = ({
  user,
  isCheckedIn,
}: {
  user: AuthUser | null;
  isCheckedIn: boolean;
}): NavButton[] => [
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
    color: peach,
  },
  {
    label: isCheckedIn ? 'Checked In!' : 'Check In',
    route: 'CheckIn',
    icon: isCheckedIn ? 'checkmark-circle-outline' : 'qr-code-outline',
    color: orange,
    url: user ? `${CHECK_IN_URL}?id=${user.id}` : CHECK_IN_URL,
  },
];

export default function QuickNavButtons() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();

  const isCheckedIn = user?.isCheckedIn === 'Yes';
  const navButtons = getNavButtons({ user, isCheckedIn });

  return (
    <View style={styles.row}>
      {navButtons.map(({ label, route, icon, color, url }) => (
        <Pressable
          key={route}
          style={styles.buttonWrapper}
          onPress={() =>
            url ? Linking.openURL(url) : navigation.navigate(route)
          }
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
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  buttonWrapper: {
    width: '48%',
    height: 120,
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
