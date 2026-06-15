import { useQuery } from '@apollo/client';
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { GET_ARTICLES } from 'contentful/queries';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';
import {
  black,
  fontSecondaryLight,
  fontTertiary,
  tablet,
} from 'utils/style-variables';

type ArticleItem = {
  title?: string;
  link?: string;
  image?: {
    url?: string;
    width?: number;
    height?: number;
  };
  date?: string;
};

type ArticlesQueryResult = {
  galleryMediaItemsCollection?: {
    items?: Array<{
      itemsCollection?: {
        items?: ArticleItem[];
      };
    }>;
  };
};

export default function Articles() {
  const { data } = useQuery<ArticlesQueryResult>(GET_ARTICLES, {
    fetchPolicy: 'no-cache',
  });
  const { width } = useWindowDimensions();
  const isTabletOrSmaller = width <= tablet;
  const articles =
    data?.galleryMediaItemsCollection?.items?.[0]?.itemsCollection?.items || [];

  const openLink = async (url?: string) => {
    if (!url) return;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  const sortedArticles = [...articles].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });

  const columns = isTabletOrSmaller ? 1 : 3;
  const gap = 20;
  const horizontalPadding = isTabletOrSmaller ? 10 : 0;
  const itemWidth =
    (width - horizontalPadding * 2 - gap * (columns - 1)) / columns;

  const normalizeImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  };

  return (
    <View>
      <SectionHeading classNames={styles.heading}>In The News</SectionHeading>
      <View
        style={[
          styles.container,
          isTabletOrSmaller ? styles.containerMobile : null,
        ]}
      >
        {sortedArticles.map((article, index) => {
          const imageUrl = normalizeImageUrl(article.image?.url);
          const imageAspectRatio =
            article.image?.width && article.image?.height
              ? article.image.width / article.image.height
              : 16 / 9;
          const formattedDate = article.date
            ? new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '';

          return (
            <Pressable
              key={`${article.title || 'article'}-${index}`}
              style={[
                styles.article,
                isTabletOrSmaller ? styles.articleMobile : { width: itemWidth },
              ]}
              onPress={() => openLink(article.link)}
              disabled={!article.link}
              accessibilityRole='link'
            >
              {imageUrl ? (
                <Image
                  source={{ uri: imageUrl }}
                  style={[
                    styles.imageLink,
                    isTabletOrSmaller ? styles.imageLinkMobile : null,
                    { aspectRatio: imageAspectRatio },
                  ]}
                  resizeMode='cover'
                />
              ) : null}

              <Text style={styles.title}>{article.title}</Text>
              <Text style={styles.date}>{formattedDate}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontFamily: fontTertiary,
    color: black,
    marginTop: 20,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    maxWidth: 1280,
    alignSelf: 'center',
    paddingVertical: 20,
    gap: 20,
  },
  containerMobile: {
    flexDirection: 'column',
    paddingHorizontal: 10,
    paddingBottom: 50,
  },
  article: {
    marginBottom: 30,
  },
  articleMobile: {
    width: '100%',
    marginBottom: 10,
  },
  imageLink: {
    width: '100%',
    minHeight: 200,
  },
  imageLinkMobile: {
    minHeight: 200,
  },
  title: {
    fontFamily: fontTertiary,
    fontSize: 18,
    color: black,
    marginTop: 10,
  },
  date: {
    fontFamily: fontSecondaryLight,
    fontSize: 14,
    color: black,
  },
});
