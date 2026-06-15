import {
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  darkGreen,
  fontTertiary,
  lightGreen,
  mobile,
  tablet,
} from 'utils/style-variables';

type ScheduleGraphic = {
  url?: string;
  width?: number;
  height?: number;
  description?: string;
};

type ScheduleProps = {
  scheduleGraphics?: ScheduleGraphic[];
};

export default function Schedule({ scheduleGraphics = [] }: ScheduleProps) {
  const { width } = useWindowDimensions();
  const isTabletOrSmaller = width <= tablet;
  const columns = width <= mobile ? 1 : width <= tablet ? 2 : 3;
  const gap = width <= mobile ? 20 : width <= tablet ? 40 : 80;
  const horizontalPadding = 16;
  const tileWidth =
    (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  return (
    <View style={styles.outerWrapper}>
      <Text
        style={[
          styles.scheduleHeading,
          isTabletOrSmaller ? styles.scheduleHeadingTablet : null,
        ]}
      >
        2025 Schedule
      </Text>

      <View style={[styles.grid, { gap }]}>
        {scheduleGraphics.map((image, index) => {
          if (!image.url) return null;

          return (
            <Image
              key={image.url || `schedule-${index}`}
              source={{ uri: image.url }}
              style={[styles.poster, { width: tileWidth }]}
              resizeMode='contain'
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    marginTop: 80,
  },
  scheduleHeading: {
    textAlign: 'center',
    marginVertical: 20,
    paddingVertical: 20,
    backgroundColor: lightGreen,
    fontFamily: fontTertiary,
    fontSize: 50,
    color: darkGreen,
  },
  scheduleHeadingTablet: {
    fontSize: 40,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 50,
    paddingHorizontal: 16,
    maxWidth: 1200,
    alignSelf: 'center',
  },
  poster: {
    marginBottom: 50,
    aspectRatio: 0.7,
  },
});
