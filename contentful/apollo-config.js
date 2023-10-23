import { ApolloClient, InMemoryCache } from '@apollo/client';
import {
  NEXT_PUBLIC_CONTENTFUL_SPACE_ID,
  NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT,
  NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN,
} from '@env';

export const contentfulClient = new ApolloClient({
  uri: `https://graphql.contentful.com/content/v1/spaces/${NEXT_PUBLIC_CONTENTFUL_SPACE_ID}/environments/${NEXT_PUBLIC_CONTENTFUL_ENVIRONMENT}?access_token=${NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
  cache: new InMemoryCache(),
  credentials: 'same-origin',
  headers: {
    authorization: `Bearer ${NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN}`,
  },
});

console.log('hey dude!');
