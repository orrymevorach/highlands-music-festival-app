import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import useReservationData from 'hooks/useReservationData';
import ReservationSummary from './ReservationSummary/ReservationSummary';
import VerifiedUsers from './VerifiedUsers/VerifiedUsers';
import BedMap from './BedMap/BedMap';
import { useAuth } from 'context/AuthContext';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
  white,
} from 'utils/style-variables';

function LogoutButton({ onLogout }: { onLogout: () => void }) {
  return (
    <Pressable style={styles.logoutButton} onPress={onLogout}>
      <Text style={styles.logoutButtonText}>Log Out</Text>
    </Pressable>
  );
}

export default function YourAccount() {
  const { user: authUser, logout } = useAuth();
  const { data, isLoading, error } = useReservationData(authUser?.id ?? null);

  if (isLoading) {
    return (
      <Layout center>
        <ActivityIndicator color={darkGreen} />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout center>
        <Text style={styles.message}>{error}</Text>
        <LogoutButton onLogout={logout} />
      </Layout>
    );
  }

  if (!data?.user?.cabin) {
    return (
      <Layout center>
        <Text style={styles.message}>You haven't reserved a cabin yet.</Text>
        <LogoutButton onLogout={logout} />
      </Layout>
    );
  }

  const members = data.group.members.length ? data.group.members : [data.user];
  const memberIds = new Set(members.map(({ id }) => id));
  const groupSelectedBeds = data.selectedBeds.filter(
    bed => bed.id && memberIds.has(bed.id),
  );
  const currentUserHasBed = data.selectedBeds.some(
    bed => bed.id === data.user?.id,
  );

  return (
    <Layout scroll>
      <View style={styles.section}>
        <Text style={styles.title}>Your Account</Text>
        <ReservationSummary cabin={data.user.cabin} />
        <VerifiedUsers members={members} currentUserId={data.user.id} />
        {currentUserHasBed && <BedMap selectedBeds={groupSelectedBeds} />}
        <LogoutButton onLogout={logout} />
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  section: {
    paddingVertical: 20,
  },
  title: {
    fontFamily: fontSecondary,
    fontSize: 24,
    color: darkGreen,
    marginBottom: 12,
  },
  message: {
    fontFamily: fontSecondary,
    color: black,
    textAlign: 'center',
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: mediumGreen,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    fontFamily: fontSecondaryBold,
    color: darkGreen,
  },
});
