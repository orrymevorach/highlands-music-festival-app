import { gql } from '@apollo/client';

export const IMAGE_FRAGMENT = gql`
  fragment ImageFields on Asset {
    url
    width
    height
    description
  }
`;

export const COMMITTEE_MEMBER_FRAGMENT = gql`
  fragment CommitteeMemberFields on CommitteeMember {
    name
    jobTitle
    image {
      url(transform: { width: 850 })
      width
      height
      description
    }
  }
`;

export const FAQ_FRAGMENT = gql`
  fragment FaqFields on Faq {
    question
    answer {
      json
    }
  }
`;
