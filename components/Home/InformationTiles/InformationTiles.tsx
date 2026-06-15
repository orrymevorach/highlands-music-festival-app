import { useQuery } from '@apollo/client';
import { useNavigation } from '@react-navigation/native';
import { Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { GET_HOME_PAGE_TILES } from 'contentful/queries';
import {
  black,
  fontSecondary,
  fontSecondaryHeavy,
  fontTertiary,
} from 'utils/style-variables';
import { MAP_URLS_TO_SCREENS } from 'utils/constants';

type TileData = {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  backgroundColor?: string;
};

type HomePageTilesQueryResult = {
  galleryHomePageTilesCollection?: {
    items?: Array<{
      tilesCollection?: {
        items?: TileData[];
      };
    }>;
  };
};

export default function InformationTiles() {
  const navigation = useNavigation<any>();
  const { data } = useQuery<HomePageTilesQueryResult>(GET_HOME_PAGE_TILES, {
    fetchPolicy: 'no-cache',
  });
  const tilesData =
    data?.galleryHomePageTilesCollection?.items?.[0]?.tilesCollection?.items ||
    [];

  const handlePress = async (url?: string) => {
    if (!url) return;

    const mappedScreen =
      MAP_URLS_TO_SCREENS[url as keyof typeof MAP_URLS_TO_SCREENS];

    if (mappedScreen) {
      navigation.navigate(mappedScreen);
      return;
    }

    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <View style={styles.container}>
      {tilesData.map(
        (
          { title, description, buttonText, buttonUrl, backgroundColor },
          index,
        ) => {
          return (
            <View
              key={`tile-${title || index}`}
              style={[
                styles.tile,
                { backgroundColor: backgroundColor || 'transparent' },
                styles.tileStack,
              ]}
            >
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.description}>{description}</Text>
              <Pressable
                onPress={() => handlePress(buttonUrl)}
                accessibilityRole='link'
                disabled={!buttonUrl}
                style={styles.buttonWrap}
              >
                <Text style={styles.buttonText}>
                  {buttonText}{' '}
                  <FontAwesomeIcon
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    icon={faArrowRight as any}
                    size={12}
                    color={black}
                  />
                </Text>
              </Pressable>
            </View>
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  tile: {
    textAlign: 'center',
    paddingVertical: 50,
    paddingHorizontal: 30,
    alignItems: 'center',
    minHeight: 400,
  },
  tileStack: {
    width: '100%',
    minHeight: undefined,
    paddingVertical: 70,
  },
  title: {
    fontFamily: fontTertiary,
    fontSize: 40,
    lineHeight: 48,
    paddingTop: 4,
    marginBottom: 30,
    marginTop: 'auto',
    textAlign: 'center',
  },
  description: {
    fontFamily: fontSecondary,
    fontSize: 18,
    lineHeight: 25,
    marginBottom: 30,
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  buttonWrap: {
    marginTop: 'auto',
    borderBottomWidth: 1,
    borderBottomColor: black,
    paddingBottom: 5,
  },
  buttonText: {
    fontFamily: fontSecondaryHeavy,
    color: black,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: 16,
    textAlign: 'center',
  },
});
