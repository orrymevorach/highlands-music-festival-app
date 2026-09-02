import { Linking, Pressable, StyleSheet, Text } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import { fontSecondaryBold, white } from 'utils/style-variables';

const SPOTIFY_GREEN = '#1DB954';
const PLAYLIST_URL =
  'https://open.spotify.com/playlist/1oKkORdCQP0YOvBKnRvD0m?si=f6dc3a81978a445b';

export default function SpotifyPlaylist() {
  return (
    <GroovyCard
      style={styles.container}
      contentStyle={styles.content}
      backgroundColor={SPOTIFY_GREEN}
    >
      <Pressable
        style={styles.button}
        onPress={() => Linking.openURL(PLAYLIST_URL)}
      >
        <FontAwesomeIcon
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          icon={faSpotify as any}
          size={32}
        />
        <Text style={styles.text}>Listen to the Highlands playlist</Text>
      </Pressable>
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
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  text: {
    flex: 1,
    fontFamily: fontSecondaryBold,
    fontSize: 16,
  },
});
