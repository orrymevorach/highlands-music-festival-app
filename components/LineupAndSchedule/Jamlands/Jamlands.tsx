import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  black,
  darkGreen,
  fontPrimary,
  fontSecondaryHeavy,
  fontSecondaryLight,
  mobile,
  orange,
} from 'utils/style-variables';

type JamlandsArtist = {
  name?: string;
  spotifyLink?: string;
};

type JamlandsProps = {
  lineup: JamlandsArtist[];
};

export default function Jamlands({ lineup }: JamlandsProps) {
  const { width } = useWindowDimensions();
  const isMobile = width <= mobile;

  const openLink = async (url?: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.jamlands}>
      <View style={styles.titleContainer}>
        <View style={[styles.sun, isMobile ? styles.sunMobile : null]} />
        <Text style={[styles.title, isMobile ? styles.titleMobile : null]}>
          JAM
          <Text
            style={[
              styles.titleInner,
              isMobile ? styles.titleInnerMobile : null,
            ]}
          >
            LANDS
          </Text>{' '}
          Lineup
        </Text>
        <View style={[styles.sun, isMobile ? styles.sunMobile : null]} />
      </View>

      <Text
        style={[styles.description, isMobile ? styles.descriptionMobile : null]}
      >
        Experience the Highlands community united for a one-night only jam
        session on Saturday, September 27th. Enjoy performances by artists from
        past and present lineups, covering your favorite songs.
      </Text>

      <View style={styles.lineup}>
        <Text
          style={[styles.featuring, isMobile ? styles.featuringMobile : null]}
        >
          Featuring
        </Text>
        {lineup.map((artist, index) => {
          const key = `${artist.name || 'artist'}-${index}`;
          return (
            <Pressable
              key={key}
              onPress={() => openLink(artist.spotifyLink)}
              disabled={!artist.spotifyLink}
              accessibilityRole={artist.spotifyLink ? 'link' : 'text'}
            >
              <Text
                style={[styles.artist, isMobile ? styles.artistMobile : null]}
              >
                {artist.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  jamlands: {
    width: '100%',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: 9,
    marginTop: 25,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  title: {
    fontFamily: fontSecondaryHeavy,
    color: orange,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontSize: 48,
  },
  titleMobile: {
    fontSize: 36,
  },
  titleInner: {
    fontFamily: fontPrimary,
    fontSize: 32,
  },
  titleInnerMobile: {
    fontSize: 24,
  },
  sun: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 50,
    backgroundColor: orange,
  },
  sunMobile: {
    marginHorizontal: 25,
  },
  description: {
    fontFamily: fontSecondaryLight,
    fontSize: 18,
    marginVertical: 30,
    textAlign: 'center',
    color: black,
  },
  descriptionMobile: {
    fontSize: 16,
    paddingHorizontal: 15,
  },
  lineup: {
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  featuring: {
    fontFamily: fontSecondaryHeavy,
    color: orange,
    textTransform: 'uppercase',
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  featuringMobile: {
    fontSize: 26,
  },
  artist: {
    fontFamily: fontPrimary,
    color: darkGreen,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: 5,
  },
  artistMobile: {
    fontSize: 22,
  },
});
