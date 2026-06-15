import type { ComponentType } from 'react';
import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  fontPrimary,
  fontSecondary,
  fontTertiary,
  mobile,
  tablet,
  white,
} from 'utils/style-variables';

type TileImage = {
  url?: string;
  width?: number;
  height?: number;
};

export type TileData = {
  name?: string;
  image?: TileImage;
  spotifyLink?: string;
  youTubeLink?: string;
  [key: string]: unknown;
};

type ImageTilesProps = {
  tiles: TileData[];
  classNames?: StyleProp<ViewStyle>;
  ImageTileBack?: ComponentType<TileData>;
  alternateTiles?: boolean;
};

const TileComponent = ({
  name,
  image,
  ImageTileBack,
  alternateTiles,
  tileWidth,
  ...rest
}: TileData & {
  ImageTileBack?: ComponentType<TileData>;
  alternateTiles?: boolean;
  tileWidth: number;
}) => {
  const [flipped, setFlipped] = useState(false);
  const { width } = useWindowDimensions();
  const tileHeight = width <= mobile ? 400 : 320;

  return (
    <Pressable
      style={[styles.tileContainer, { width: tileWidth, height: tileHeight }]}
      onPress={() => ImageTileBack && setFlipped(prev => !prev)}
      accessibilityRole='button'
    >
      {flipped && ImageTileBack ? (
        <View style={StyleSheet.absoluteFill}>
          <ImageTileBack name={name} image={image} {...rest} />
        </View>
      ) : (
        <>
          {image?.url ? (
            <Image
              source={{ uri: image.url }}
              style={styles.image}
              resizeMode='cover'
            />
          ) : (
            <View style={styles.imageFallback} />
          )}
          <View style={styles.overlay}>
            <Text
              style={[
                styles.name,
                alternateTiles ? styles.nameAlternate : null,
              ]}
            >
              {name}
            </Text>
          </View>
        </>
      )}
    </Pressable>
  );
};

export default function ImageTiles({
  tiles,
  classNames,
  ImageTileBack,
  alternateTiles = false,
}: ImageTilesProps) {
  const { width } = useWindowDimensions();

  const isMobile = width <= mobile;
  const isTablet = width <= tablet;
  const columns = isMobile ? 1 : isTablet ? 2 : 3;
  const tileWidth = (width - 32 - (columns - 1) * 10) / columns;

  return (
    <View style={[styles.container, classNames]}>
      {tiles.map((artist, index) => {
        if (!artist) return null;
        return (
          <TileComponent
            {...artist}
            key={`tile-${artist.name || index}`}
            ImageTileBack={ImageTileBack}
            alternateTiles={alternateTiles}
            tileWidth={tileWidth}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 10,
    justifyContent: 'center',
  },
  tileContainer: {
    marginBottom: 20,
    overflow: 'hidden',
    backgroundColor: '#d9d9d9',
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
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  name: {
    fontFamily: fontPrimary,
    fontSize: 32,
    color: white,
    marginHorizontal: 10,
    textAlign: 'center',
    zIndex: 2,
  },
  nameAlternate: {
    fontFamily: fontTertiary,
  },
  backContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: fontSecondary,
    fontSize: 20,
  },
});
