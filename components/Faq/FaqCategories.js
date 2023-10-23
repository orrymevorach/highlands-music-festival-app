import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { darkGreen } from 'utils/style-variables';
import FaqParagraph from './FaqParagraph';

export default function FaqCategories({ categoryData }) {
  return (
    <SafeAreaView>
      {categoryData.map(({ categoryName, questions }) => {
        return (
          <View key={categoryName}>
            <Text style={styles.categoryHeading}>{categoryName}</Text>
            {questions.map(({ question, answer }) => {
              return (
                <FaqParagraph
                  key={question}
                  question={question}
                  answer={answer}
                />
              );
            })}
          </View>
        );
      })}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  categoryHeading: {
    fontSize: 26,
    color: darkGreen,
    marginTop: 40,
    marginBottom: 30,
  },
});
