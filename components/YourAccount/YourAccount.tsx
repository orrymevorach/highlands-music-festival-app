import {
  ActivityIndicator,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Layout from 'components/shared/Layout/Layout';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import Button from 'components/shared/Button/Button';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';
import useReservationData from 'hooks/useReservationData';
import ReservationSummary from './ReservationSummary/ReservationSummary';
import VerifiedUsers from './VerifiedUsers/VerifiedUsers';
import BedMap from './BedMap/BedMap';
import { useAuth } from 'context/AuthContext';
import {
  black,
  blue,
  darkGreen,
  fontSecondary,
  peach,
} from 'utils/style-variables';
import { PRIVACY_POLICY_URL, SUPPORT_URL } from 'utils/constants';

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
        <Button isDarkGreen isSmall handleClick={logout}>
          Log Out
        </Button>
      </Layout>
    );
  }

  if (!data?.user?.cabin) {
    return (
      <Layout center>
        <Text style={styles.message}>
          You haven&apos;t reserved a cabin yet.
        </Text>
        <Button isDarkGreen isSmall handleClick={logout}>
          Log Out
        </Button>
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

  const unitName = Array.isArray(data.user.cabin.unit)
    ? data.user.cabin.unit[0]
    : data.user.cabin.unit;
  const unit = data.cabinAndUnitData?.units.find(
    ({ name }) => name === unitName,
  );
  const unitMapImageUrl = unit?.image?.[0]?.url;

  return (
    <Layout scroll paddingHorizontal={0}>
      <SectionHeading classNames={styles.title}>Your Account</SectionHeading>

      <GroovyCard
        style={styles.card}
        contentStyle={styles.cardContent}
        backgroundColor={blue}
      >
        <ReservationSummary
          cabin={data.user.cabin}
          unitMapImageUrl={unitMapImageUrl}
        />
      </GroovyCard>

      <GroovyCard
        style={styles.card}
        contentStyle={styles.cardContent}
        backgroundColor={peach}
      >
        <VerifiedUsers members={members} currentUserId={data.user.id} />
      </GroovyCard>

      {currentUserHasBed && (
        <GroovyCard style={styles.card} contentStyle={styles.cardContent}>
          <BedMap selectedBeds={groupSelectedBeds} />
        </GroovyCard>
      )}

      <Button
        isDarkGreen
        isSmall
        classNames={styles.logoutButton}
        handleClick={logout}
      >
        Log Out
      </Button>

      <View style={styles.legalLinks}>
        <Pressable onPress={() => Linking.openURL(PRIVACY_POLICY_URL)}>
          <Text style={styles.legalLink}>Privacy Policy</Text>
        </Pressable>
        <Pressable onPress={() => Linking.openURL(SUPPORT_URL)}>
          <Text style={styles.legalLink}>Support</Text>
        </Pressable>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  title: {
    marginBottom: 4,
  },
  card: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
  },
  message: {
    fontFamily: fontSecondary,
    color: black,
    textAlign: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 4,
    marginBottom: 30,
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 24,
  },
  legalLink: {
    fontFamily: fontSecondary,
    color: darkGreen,
    textDecorationLine: 'underline',
  },
});
