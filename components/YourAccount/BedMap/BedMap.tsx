import { StyleSheet, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBed } from '@fortawesome/free-solid-svg-icons';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
  white,
} from 'utils/style-variables';
import type { ReservationBed } from 'hooks/useReservationData';
import { BED_LABELS } from 'utils/bedLabels';

// grouped so there's extra spacing between bunk/loft/cot clusters, matching
// the physical layout in the web app's cabin.jsx
const leftBedGroups = [
  ['backBunkLeft'],
  ['backLoftLeft', 'frontLoftLeft'],
  ['backCotLeft', 'frontCotLeft'],
  ['frontBunkLeft'],
];

const rightBedGroups = [
  ['backBunkRight'],
  ['backLoftRight', 'frontLoftRight'],
  ['backCotRight', 'frontCotRight'],
  ['frontBunkRight'],
];

type BedSlotProps = {
  bedKey: string;
  selectedBeds: ReservationBed[];
  side: 'left' | 'right';
};

function BedSlot({ bedKey, selectedBeds, side }: BedSlotProps) {
  const occupant = selectedBeds.find(bed => bed.bedName === bedKey);

  const icon = (
    <View style={[styles.bedIcon, occupant && styles.bedIconOccupied]}>
      <FontAwesomeIcon
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        icon={faBed as any}
        size={22}
        color={occupant ? white : mediumGreen}
        style={side === 'right' ? styles.iconFlipped : undefined}
      />
    </View>
  );

  const text = (
    <View style={styles.bedText}>
      <Text
        style={[styles.bedLabel, side === 'right' && styles.textRight]}
        numberOfLines={1}
      >
        {BED_LABELS[bedKey]}
      </Text>
      <Text
        style={[
          styles.occupantName,
          occupant && styles.occupantNameFilled,
          side === 'right' && styles.textRight,
        ]}
        numberOfLines={1}
      >
        {occupant ? occupant.name : 'Available'}
      </Text>
    </View>
  );

  return (
    <View
      style={[
        styles.bedSlot,
        side === 'left' ? styles.bedSlotLeft : styles.bedSlotRight,
      ]}
    >
      {side === 'left' ? (
        <>
          {text}
          {icon}
        </>
      ) : (
        <>
          {icon}
          {text}
        </>
      )}
    </View>
  );
}

type BedColumnProps = {
  bedGroups: string[][];
  selectedBeds: ReservationBed[];
  side: 'left' | 'right';
};

function BedColumn({ bedGroups, selectedBeds, side }: BedColumnProps) {
  return (
    <View style={styles.column}>
      {bedGroups.map(group => (
        <View key={group.join('-')} style={styles.bedGroup}>
          {group.map(bedKey => (
            <BedSlot
              key={bedKey}
              bedKey={bedKey}
              selectedBeds={selectedBeds}
              side={side}
            />
          ))}
        </View>
      ))}
    </View>
  );
}

type BedMapProps = {
  selectedBeds: ReservationBed[];
};

export default function BedMap({ selectedBeds }: BedMapProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bed Map</Text>
      <View style={styles.cabinContainer}>
        <BedColumn
          bedGroups={leftBedGroups}
          selectedBeds={selectedBeds}
          side='left'
        />
        <View style={styles.aisle} />
        <BedColumn
          bedGroups={rightBedGroups}
          selectedBeds={selectedBeds}
          side='right'
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  title: {
    fontFamily: fontSecondaryBold,
    color: black,
    marginBottom: 8,
  },
  cabinContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    alignSelf: 'center',
  },
  aisle: {
    width: 24,
  },
  column: {
    width: 156,
    gap: 24,
  },
  bedGroup: {
    gap: 2,
  },
  bedSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  bedSlotLeft: {
    justifyContent: 'flex-end',
  },
  bedSlotRight: {
    justifyContent: 'flex-start',
  },
  bedText: {
    width: 100,
  },
  bedIcon: {
    width: 48,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: mediumGreen,
    backgroundColor: white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bedIconOccupied: {
    backgroundColor: darkGreen,
    borderColor: darkGreen,
  },
  bedLabel: {
    fontFamily: fontSecondary,
    fontSize: 9,
    color: mediumGreen,
  },
  occupantName: {
    fontFamily: fontSecondaryBold,
    fontSize: 11,
    color: black,
    marginTop: 2,
  },
  occupantNameFilled: {
    color: darkGreen,
  },
  textRight: {
    textAlign: 'right',
  },
  iconFlipped: {
    transform: [{ scaleX: -1 }],
  },
});
