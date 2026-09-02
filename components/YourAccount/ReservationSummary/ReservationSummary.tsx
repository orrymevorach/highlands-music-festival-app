import { useState } from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Button from 'components/shared/Button/Button';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  gold,
  white,
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
  unitMapImageUrl?: string;
};

export default function ReservationSummary({
  cabin,
  unitMapImageUrl,
}: ReservationSummaryProps) {
  const [showMap, setShowMap] = useState(false);
  const { name, unit, category } = cabin;
  const unitName = Array.isArray(unit) ? unit[0] : unit;
  const categoryName = category?.[0];
  const showCategory = Boolean(categoryName) && categoryName !== 'Anywhere!';

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
      {showCategory && (
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Pill isGold>{categoryName as string}</Pill>
        </View>
      )}

      {unitMapImageUrl && (
        <Button
          isGold
          isSmall
          classNames={styles.mapButton}
          handleClick={() => setShowMap(true)}
        >
          Map Of {unitName}
        </Button>
      )}

      <Modal
        visible={showMap}
        animationType='fade'
        transparent
        onRequestClose={() => setShowMap(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setShowMap(false)}
        >
          <View style={styles.modalCard}>
            {unitMapImageUrl && (
              <Image
                source={{ uri: unitMapImageUrl }}
                style={styles.mapImage}
                resizeMode='contain'
              />
            )}
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowMap(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
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
  mapButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    backgroundColor: white,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: 320,
    borderRadius: 8,
    marginBottom: 12,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    backgroundColor: darkGreen,
    borderRadius: 8,
  },
  closeButtonText: {
    fontFamily: fontSecondaryBold,
    color: white,
  },
});
