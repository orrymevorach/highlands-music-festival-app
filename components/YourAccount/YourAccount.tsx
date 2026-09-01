import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import useReservationData from 'hooks/useReservationData';
import ReservationSummary from './ReservationSummary/ReservationSummary';
import VerifiedUsers from './VerifiedUsers/VerifiedUsers';
import BedMap from './BedMap/BedMap';
import { black, darkGreen, fontSecondary } from 'utils/style-variables';

export default function YourAccount() {
  const { data, isLoading, error } = useReservationData();

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
      </Layout>
    );
  }

  if (!data?.user?.cabin) {
    return (
      <Layout center>
        <Text style={styles.message}>You haven't reserved a cabin yet.</Text>
      </Layout>
    );
  }

  const members = data.group.members.length ? data.group.members : [data.user];
  const memberIds = new Set(members.map(({ id }) => id));
  const groupSelectedBeds = data.selectedBeds.filter(bed => memberIds.has(bed.id));
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
});
