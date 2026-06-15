import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  darkGreen,
  fontSecondary,
  fontTertiary,
  lightGreen,
  tablet,
  white,
} from 'utils/style-variables';

type LineupGraphic = {
  url: string;
  height?: number;
  width?: number;
};

type PastLineupsProps = {
  lineupGraphics?: LineupGraphic[];
};

export default function PastLineups({ lineupGraphics = [] }: PastLineupsProps) {
  const [lineupGraphic, setLineupGraphic] = useState<LineupGraphic | null>(
    null,
  );
  const { width } = useWindowDimensions();
  const isTabletOrSmaller = width <= tablet;

  const closeModal = () => setLineupGraphic(null);

  return (
    <View>
      <Text
        style={[styles.title, isTabletOrSmaller ? styles.titleTablet : null]}
      >
        Past Lineups
      </Text>

      <View
        style={[
          styles.pastLineups,
          isTabletOrSmaller ? styles.pastLineupsStacked : null,
        ]}
      >
        {lineupGraphics.map((graphic, index) => (
          <Pressable
            key={graphic.url || `graphic-${index}`}
            style={[
              styles.lineupGraphic,
              isTabletOrSmaller ? styles.lineupGraphicStacked : null,
            ]}
            onPress={() => setLineupGraphic(graphic)}
            accessibilityRole='button'
          >
            <Image
              source={{ uri: graphic.url }}
              style={styles.lineupImage}
              resizeMode='contain'
            />
          </Pressable>
        ))}
      </View>

      <Modal
        visible={Boolean(lineupGraphic)}
        transparent
        animationType='fade'
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalBackdrop} onPress={closeModal}>
          <Pressable style={styles.modalContent} onPress={() => {}}>
            {lineupGraphic?.url ? (
              <Image
                source={{ uri: lineupGraphic.url }}
                style={[
                  styles.modalLineupGraphic,
                  isTabletOrSmaller ? styles.modalLineupGraphicTablet : null,
                ]}
                resizeMode='contain'
              />
            ) : null}
            <Text style={styles.modalHint}>Tap outside to close</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    marginVertical: 20,
    paddingVertical: 20,
    textAlign: 'center',
    backgroundColor: lightGreen,
    fontFamily: fontTertiary,
    fontSize: 50,
    color: darkGreen,
  },
  titleTablet: {
    fontSize: 40,
  },
  pastLineups: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignSelf: 'center',
    width: '100%',
    maxWidth: 1280,
    paddingHorizontal: 10,
    gap: 20,
  },
  pastLineupsStacked: {
    paddingHorizontal: 15,
    gap: 0,
  },
  lineupGraphic: {
    width: '49%',
  },
  lineupGraphicStacked: {
    width: '100%',
    marginBottom: 25,
  },
  lineupImage: {
    width: '100%',
    aspectRatio: 1,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  modalContent: {
    width: '100%',
    maxWidth: 760,
    alignItems: 'center',
  },
  modalLineupGraphic: {
    width: 700,
    maxWidth: '100%',
    aspectRatio: 1,
  },
  modalLineupGraphicTablet: {
    width: '100%',
  },
  modalHint: {
    marginTop: 10,
    color: white,
    fontFamily: fontSecondary,
    fontSize: 14,
  },
});
