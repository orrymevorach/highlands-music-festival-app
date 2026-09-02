import { StyleSheet, Text, View } from 'react-native';
import { GET_FAQ_PAGE } from 'contentful/queries';
import { useQuery } from '@apollo/client';
import FaqCategories from './FaqCategories';
import { darkGreen } from 'utils/style-variables';
import Loader from 'components/Loader/Loader';
import { getCategoryData } from './faq-utils';
import Layout from 'components/shared/Layout/Layout';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';

export default function Faq() {
  const { data, loading } = useQuery(GET_FAQ_PAGE);
  const faqData = data?.faqPageCollection.items[0];

  if (loading || !faqData) return <Loader />;
  const categoryData = getCategoryData({ faqData });

  return (
    <Layout scroll paddingHorizontal={0}>
      <SectionHeading>FAQ</SectionHeading>
      <View style={styles.content}>
        <FaqCategories categoryData={categoryData} />
        <Text style={styles.otherQuestionsHeading}>
          What if I have other questions?
        </Text>
        <Text style={styles.otherQuestionsText}>
          Please reach out to us at info@highlandsmusicfestival.ca for any
          questions about the festival!
        </Text>
      </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: 20,
  },
  otherQuestionsHeading: {
    fontSize: 30,
    marginTop: 80,
    marginBottom: 10,
    color: darkGreen,
  },
  otherQuestionsText: {
    fontSize: 20,
    marginBottom: 50,
    color: darkGreen,
  },
});
