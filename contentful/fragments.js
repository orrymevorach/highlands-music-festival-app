import { gql } from '@apollo/client';

export const FAQ_FRAGMENT = gql`
  fragment FaqFields on Faq {
    question
    answer {
      json
    }
  }
`;
