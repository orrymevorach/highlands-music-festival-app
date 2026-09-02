import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import GroovyCard from 'components/shared/GroovyCard/GroovyCard';
import Button from 'components/shared/Button/Button';
import { useAnnouncements } from 'components/Announcements/useAnnouncements';
import {
  black,
  darkGreen,
  fontSecondary,
  fontSecondaryBold,
  mediumGreen,
} from 'utils/style-variables';

export default function RecentAnnouncements() {
  const navigation = useNavigation<any>();
  const { items, loading } = useAnnouncements();
  const recentItems = items.slice(0, 3);

  if (loading || recentItems.length === 0) return null;

  return (
    <GroovyCard style={styles.container} contentStyle={styles.content}>
      <Text style={styles.title}>Recent Announcements</Text>
      {recentItems.map(item => (
        <View key={item.id} style={styles.item}>
          <Text style={styles.itemTitle}>{item.title || 'Untitled'}</Text>
          {item.body ? (
            <Text style={styles.itemBody} numberOfLines={2}>
              {item.body}
            </Text>
          ) : null}
        </View>
      ))}
      <Button
        isDarkGreen
        isSmall
        classNames={styles.viewAllButton}
        handleClick={() => navigation.navigate('Announcements')}
      >
        View All Announcements
      </Button>
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
  title: {
    fontFamily: fontSecondaryBold,
    fontSize: 18,
    color: darkGreen,
    marginBottom: 12,
  },
  item: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: mediumGreen,
  },
  itemTitle: {
    fontFamily: fontSecondaryBold,
    color: black,
    marginBottom: 4,
  },
  itemBody: {
    fontFamily: fontSecondary,
    color: black,
  },
  viewAllButton: {
    marginTop: 4,
  },
});
