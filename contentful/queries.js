import { gql } from '@apollo/client';
import { FAQ_FRAGMENT } from './fragments';

export const GET_FAQ_PAGE = gql`
  query GetFaqPage {
    faqPageCollection(where: { title: "FAQ Page" }) {
      items {
        arrivalDepartureCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
        festivalOperationsCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
        accommodationsPackingCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
        foodBeverageCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
        ticketsCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
        musicEntertainmentCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
        healthAndSafetyCollection(limit: 15) {
          items {
            ...FaqFields
          }
        }
      }
    }
  }
  ${FAQ_FRAGMENT}
`;
