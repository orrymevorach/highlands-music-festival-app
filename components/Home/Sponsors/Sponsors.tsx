import { useQuery } from '@apollo/client';
import { Image, StyleSheet, Text, View } from 'react-native';
import { GET_VENDORS } from 'contentful/queries';
import { black, fontTertiary, lightGreen } from 'utils/style-variables';

type VendorItem = {
  name?: string;
  logo?: {
    url?: string;
    width?: number;
    height?: number;
  };
};

type VendorsQueryResult = {
  galleryVendorsCollection?: {
    items?: Array<{
      vendorsCollection?: { items?: VendorItem[] };
      partnersCollection?: { items?: VendorItem[] };
      sponsorsCollection?: { items?: VendorItem[] };
    }>;
  };
};

export default function Sponsors() {
  const { data } = useQuery<VendorsQueryResult>(GET_VENDORS);

  const vendors =
    data?.galleryVendorsCollection?.items?.[0]?.vendorsCollection?.items || [];
  const partners =
    data?.galleryVendorsCollection?.items?.[0]?.partnersCollection?.items || [];
  const sponsors =
    data?.galleryVendorsCollection?.items?.[0]?.sponsorsCollection?.items || [];

  const vendorData = { vendors, partners, sponsors };
  const sponsorItems = vendorData.sponsors;

  const normalizeImageUrl = (url?: string) => {
    if (!url) return undefined;
    if (url.startsWith('//')) return `https:${url}`;
    return url;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Our Sponsors</Text>
      <View style={styles.grid}>
        {sponsorItems.map((mediaItem, index) => {
          const imageUrl = normalizeImageUrl(mediaItem.logo?.url);
          const aspectRatio =
            mediaItem.logo?.width && mediaItem.logo?.height
              ? mediaItem.logo.width / mediaItem.logo.height
              : 2;

          if (!imageUrl) return null;

          return (
            <View
              key={`${mediaItem.name || 'sponsor'}-${index}`}
              style={styles.logo}
            >
              <Image
                source={{ uri: imageUrl }}
                style={[styles.image, { aspectRatio }]}
                resizeMode='contain'
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: `${lightGreen}66`,
    paddingVertical: 28,
  },
  title: {
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: fontTertiary,
    fontSize: 28,
    color: black,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignSelf: 'center',
    justifyContent: 'center',
    columnGap: 8,
    rowGap: 24,
  },
  logo: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  image: {
    width: '100%',
    paddingHorizontal: 8,
    paddingVertical: 6,
    maxWidth: 380,
    maxHeight: 120,
  },
});
