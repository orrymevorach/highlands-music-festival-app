import { useNavigation } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Button from 'components/shared/Button/Button';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import { useAuth } from 'context/AuthContext';
import useReservationData from 'hooks/useReservationData';
import { getBedLabel } from 'utils/bedLabels';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
} from 'utils/style-variables';

const BOOK_A_CABIN_URL = 'https://reservations.highlandsmusicfestival.ca';
const RESERVE_A_BED_URL =
  'https://reservations.highlandsmusicfestival.ca/summary?stage=BED_SELECTION';

export default function CabinSummary() {
  const navigation = useNavigation<any>();
  const { user, isLoggedIn, isCheckingSession } = useAuth();
  const { data, isLoading } = useReservationData(
    isLoggedIn ? (user?.id ?? null) : null,
  );

  if (isCheckingSession) return null;

  if (!isLoggedIn) {
    return (
      <GroovyCard style={styles.container} contentStyle={styles.content}>
        <Text style={styles.title}>Your Cabin</Text>
        <Text style={styles.text}>Log in to see your cabin details.</Text>
        <Button
          isDarkGreen
          isSmall
          handleClick={() => navigation.navigate('Login')}
        >
          Log In
        </Button>
      </GroovyCard>
    );
  }

  if (isLoading) {
    return (
      <GroovyCard style={styles.container} contentStyle={styles.content}>
        <ActivityIndicator color={darkGreen} />
      </GroovyCard>
    );
  }

  const cabin = data?.user?.cabin;

  if (!cabin) {
    return (
      <GroovyCard style={styles.container} contentStyle={styles.content}>
        <Text style={styles.title}>Your Cabin</Text>
        <Text style={styles.text}>You haven't reserved a cabin yet.</Text>
        <Button isDarkGreen isSmall href={BOOK_A_CABIN_URL}>
          Book Your Cabin Now
        </Button>
      </GroovyCard>
    );
  }

  const unitName = Array.isArray(cabin.unit) ? cabin.unit[0] : cabin.unit;
  const currentUserBed = data?.selectedBeds.find(bed => bed.id === user?.id);

  return (
    <GroovyCard style={styles.container} contentStyle={styles.content}>
      <Text style={styles.title}>Your Cabin</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Cabin:</Text>
        <Text style={styles.value}>{cabin.name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Unit:</Text>
        <Text style={styles.value}>{unitName}</Text>
      </View>
      {currentUserBed ? (
        <View style={styles.row}>
          <Text style={styles.label}>Bed:</Text>
          <Text style={styles.value}>
            {getBedLabel(currentUserBed.bedName)}
          </Text>
        </View>
      ) : (
        <>
          <Text style={styles.text}>You haven't reserved a bed yet.</Text>
          <Button isDarkGreen isSmall href={RESERVE_A_BED_URL}>
            Reserve Your Bed
          </Button>
        </>
      )}

      <Button
        isDarkGreen
        isSmall
        classNames={styles.viewDetailsButton}
        handleClick={() => navigation.navigate('Account')}
      >
        View Reservation Details
      </Button>
    </GroovyCard>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 20,
  },
  content: {
    padding: 20,
  },
  title: {
    fontFamily: fontSecondaryBold,
    fontSize: 18,
    color: darkGreen,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  label: {
    width: 60,
    fontFamily: fontSecondary,
    color: mediumGreen,
  },
  value: {
    fontFamily: fontSecondaryBold,
    color: black,
  },
  text: {
    fontFamily: fontSecondary,
    color: black,
    marginBottom: 12,
  },
  viewDetailsButton: {
    marginTop: 12,
  },
});
