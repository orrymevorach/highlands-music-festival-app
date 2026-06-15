import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSpotify, faYoutube } from '@fortawesome/free-brands-svg-icons';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';
import ImageTiles from 'components/shared/ImageTiles/ImageTiles';
import Jamlands from '../Jamlands/Jamlands';
import {
  black,
  darkGreen,
  fontPrimary,
  fontSecondary,
  fontTertiary,
  lightGreen,
  white,
} from 'utils/style-variables';

type LineupArtist = {
  name?: string;
  spotifyLink?: string;
  youTubeLink?: string;
};

type LineupData = {
  headlinersCollection?: { items?: LineupArtist[] };
  artistsCollection?: { items?: LineupArtist[] };
  jamlandsCollection?: { items?: LineupArtist[] };
};

type LineupGraphic = {
  url?: string;
  width?: number;
  height?: number;
};

type LineupProps = {
  headlinerFeatureFlag?: boolean;
  lineup?: LineupData;
  lineupGraphics?: LineupGraphic[];
};

const getFormattedLineup = (lineup: LineupData) => {
  const headliners = lineup?.headlinersCollection?.items || [];
  const artists = lineup?.artistsCollection?.items || [];
  return [...headliners, ...artists];
};

const getCurrentYear = () => new Date().getFullYear();

export default function Lineup({ lineup }: LineupProps) {
  const formattedLineup = lineup ? getFormattedLineup(lineup) : [];
  const jamlandsLineup = lineup?.jamlandsCollection?.items || [];
  const year = getCurrentYear();
  const ImageTileBack = ({
    spotifyLink,
    youTubeLink,
  }: {
    spotifyLink?: string;
    youTubeLink?: string;
  }) => {
    const link = spotifyLink || youTubeLink;
    const isSpotify = Boolean(spotifyLink);

    const openLink = async () => {
      if (!link) return;
      const supported = await Linking.canOpenURL(link);
      if (supported) await Linking.openURL(link);
    };

    if (!link) return <View style={styles.imageTileBack} />;

    return (
      <Pressable
        style={styles.imageTileBack}
        onPress={openLink}
        accessibilityRole='link'
      >
        <Text style={styles.listenText}>
          Listen on {isSpotify ? 'Spotify' : 'YouTube'}
        </Text>
        <FontAwesomeIcon
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          icon={isSpotify ? (faSpotify as any) : (faYoutube as any)}
          size={28}
          color={white}
        />
      </Pressable>
    );
  };

  return (
    <View>
      <SectionHeading classNames={styles.title}>
        {`${year} Lineup`}
        {'\n'}
        <Text style={styles.small}>
          (stay tuned for more artist announcements...)
        </Text>
      </SectionHeading>

      <ImageTiles
        tiles={formattedLineup}
        alternateTiles
        ImageTileBack={ImageTileBack}
        classNames={styles.tilesContainer}
      />
      {jamlandsLineup?.length > 0 && <Jamlands lineup={jamlandsLineup} />}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    backgroundColor: lightGreen,
    color: black,
    fontFamily: fontTertiary,
    fontSize: 50,
  },
  small: {
    fontSize: 14,
    marginLeft: 15,
    color: black,
    textAlign: 'center',
    marginBottom: 10,
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: fontPrimary,
    color: darkGreen,
    marginTop: 50,
  },
  paragraph: {
    textAlign: 'center',
    color: white,
    fontFamily: fontSecondary,
    fontSize: 18,
  },
  tilesContainer: {
    position: 'relative',
    paddingHorizontal: 16,
    gap: 8,
  },
  imageTileBack: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    // radial-gradient(circle, #5a7a2e 0%, darkGreen 80%) approximated as solid darkGreen
    backgroundColor: darkGreen,
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  listenText: {
    marginBottom: 7,
    color: white,
    fontFamily: fontSecondary,
    fontSize: 18,
  },
  jamlandsContainer: {
    marginTop: 10,
    paddingVertical: 8,
  },
  jamlandsHeading: {
    fontFamily: fontTertiary,
    fontSize: 28,
    color: darkGreen,
    textAlign: 'center',
    marginBottom: 6,
  },
  jamlandsItem: {
    fontFamily: fontSecondary,
    fontSize: 17,
    color: darkGreen,
    textAlign: 'center',
    marginVertical: 2,
  },
  separator: {
    height: 200,
    width: 1,
    backgroundColor: '#000',
    marginVertical: 50,
    alignSelf: 'center',
  },
});
