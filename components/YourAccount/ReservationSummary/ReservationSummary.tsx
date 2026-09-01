import { StyleSheet, Text, View } from 'react-native';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  gold,
} from 'utils/style-variables';
import type { ReservationCabin } from 'hooks/useReservationData';

type PillProps = {
  children: string;
  isGold?: boolean;
};

function Pill({ children, isGold = false }: PillProps) {
  return (
    <View style={[styles.pill, isGold && styles.pillGold]}>
      <Text style={styles.pillText}>{children}</Text>
    </View>
  );
}

type ReservationSummaryProps = {
  cabin: ReservationCabin;
};

export default function ReservationSummary({ cabin }: ReservationSummaryProps) {
  const { name, unit, additionalInformation, category } = cabin;
  const unitName = Array.isArray(unit) ? unit[0] : unit;
  const categoryName = category?.[0];
  const hasAdditionalInformation = Boolean(additionalInformation?.length);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Cabin:</Text>
        <Text style={styles.value}>{name}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Unit:</Text>
        <Text style={styles.value}>{unitName}</Text>
      </View>
      {categoryName && (
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Pill isGold>{categoryName}</Pill>
        </View>
      )}
      {hasAdditionalInformation && (
        <View style={styles.additionalInformationContainer}>
          <Text style={styles.additionalInformationTitle}>
            Additional information:
          </Text>
          <View style={styles.additionalInformationList}>
            {additionalInformation
              ?.filter(detail => detail !== categoryName)
              .map(detail => (
                <Pill key={detail}>{detail}</Pill>
              ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    width: 70,
    fontFamily: fontSecondary,
    color: black,
  },
  value: {
    fontFamily: fontSecondaryBold,
    color: black,
  },
  additionalInformationContainer: {
    marginTop: 8,
  },
  additionalInformationTitle: {
    fontFamily: fontSecondaryBold,
    color: black,
    marginBottom: 6,
  },
  additionalInformationList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: darkGreen,
  },
  pillGold: {
    backgroundColor: gold,
  },
  pillText: {
    fontFamily: fontSecondary,
    fontSize: 12,
    color: '#fff',
  },
});
