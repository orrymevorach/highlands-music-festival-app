import RichText from 'components/shared/RichText/RichText';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { mediumGreen } from 'utils/style-variables';

export default function FaqParagraph({ question, answer }) {
  const [showAnswer, setShowAnswer] = useState(false);
  return (
    <View style={styles.faqQuestionContainer}>
      <Pressable onPress={() => setShowAnswer(!showAnswer)}>
        <Text style={styles.question}>{question}</Text>
      </Pressable>
      {showAnswer && (
        <View style={styles.answer}>
          <RichText json={answer.json} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  faqQuestionContainer: {
    marginVertical: 5,
  },
  question: {
    fontSize: 20,
    color: mediumGreen,
    marginRight: 10,
  },
  answer: {
    marginVertical: 10,
  },
});
