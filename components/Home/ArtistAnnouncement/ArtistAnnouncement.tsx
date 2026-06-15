import { Image, StyleSheet, Text, View } from 'react-native';

type Headliner = {
  name?: string;
  image?: {
    url?: string;
  };
};

type ArtistAnnouncementProps = {
  headliners?: Headliner[];
  headlineTransitionPeriodFeatureFlag?: boolean;
};

function HeadlinerCard({ headliner }: { headliner: Headliner }) {
  const imageUrl = headliner.image?.url;

  return (
    <View style={styles.headliner}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.image} />
      ) : (
        <View style={styles.imageFallback} />
      )}
      <View style={styles.overlay}>
        <Text style={styles.overlayName}>{headliner.name || 'Artist'}</Text>
      </View>
    </View>
  );
}

export default function ArtistAnnouncement({
  headliners = [],
}: ArtistAnnouncementProps) {
  const visibleHeadliners = headliners.slice(0, 3);

  if (!visibleHeadliners.length) return null;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.heading}>
        {visibleHeadliners.length > 1
          ? '2026 Headliners:'
          : 'Headliner Announcement:'}
      </Text>
      <View style={styles.container}>
        <View style={styles.imagesContainer}>
          {visibleHeadliners.map((headliner, index) => (
            <HeadlinerCard
              key={`${headliner.name || 'headliner'}-${index}`}
              headliner={headliner}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  heading: {
    width: '100%',
    textAlign: 'center',
    fontSize: 28,
    marginBottom: 12,
  },
  container: {
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#000',
  },
  imagesContainer: {
    width: '100%',
  },
  headliner: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#d9d9d9',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayName: {
    color: '#fff',
    fontSize: 32,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
