import { gql } from '@apollo/client';
import {
  COMMITTEE_MEMBER_FRAGMENT,
  FAQ_FRAGMENT,
  IMAGE_FRAGMENT,
} from './fragments';

export const GET_FEATURE_FLAG = gql`
  query getFeatureFlag($name: String) {
    featureFlagCollection(where: { name: $name }) {
      items {
        name
        value
      }
    }
  }
`;

export const GET_COMMITTEE_MEMBERS = gql`
  query GetCommitteeMembers {
    galleryCommitteeMembersCollection(
      where: { queryTitle: "Committee Members Gallery" }
      limit: 1
    ) {
      items {
        foundingMembersCollection {
          items {
            ...CommitteeMemberFields
          }
        }
        friendsOfHighlandsCollection {
          items {
            ...CommitteeMemberFields
          }
        }
      }
    }
  }
  ${COMMITTEE_MEMBER_FRAGMENT}
`;

export const GET_NAVIGATION_BAR = gql`
  query GetNavigationBar {
    navigationBarCollection(where: { title: "HOME_NAVIGATION_BAR" }) {
      items {
        pageCollection {
          items {
            label
            url
          }
        }
      }
    }
  }
`;

export const GET_FOOTER = gql`
  query GetFooter {
    footerCollection(where: { title: "Footer" }, limit: 1) {
      items {
        title
        columnCollection(limit: 6) {
          items {
            title
            itemsCollection(limit: 15) {
              items {
                ... on Dropdown {
                  title
                  itemsCollection {
                    items {
                      label
                      url
                    }
                  }
                  __typename
                }
                ... on Link {
                  label
                  url
                  __typename
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_IS_PAGE_PUBLISHED = gql`
  query GetIsPagePublished($url: String!) {
    pageCollection(where: { url: $url }) {
      items {
        label
        isPasswordProtected
        password
      }
    }
  }
`;

export const GET_LINEUP_AND_SCHEDULE = gql`
  query GetLineup {
    lineupCollection(where: { title: "2026_LINEUP" }) {
      items {
        headlinersCollection(limit: 5) {
          items {
            name
            image {
              url(transform: { width: 850 })
              width
              height
              description
            }
            spotifyLink
            youTubeLink
          }
        }
        artistsCollection(limit: 20) {
          items {
            name
            image {
              url(transform: { width: 850 })
              width
              height
              description
            }
            spotifyLink
            youTubeLink
          }
        }
        jamlandsCollection(limit: 10) {
          items {
            name
            spotifyLink
            youTubeLink
          }
        }
        scheduleCollection(limit: 10) {
          items {
            url(transform: { width: 850 })
            width
            height
            description
          }
        }
      }
    }
  }
`;

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

export const GET_ACTIVITIES = gql`
  query getActivities {
    galleryActivitiesCollection(where: { title: "Activities" }, limit: 1) {
      items {
        activitiesCollection {
          items {
            name
            description {
              json
            }
            image {
              ...ImageFields
            }
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const GET_VENDORS = gql`
  query getVendors {
    galleryVendorsCollection(where: { year: "2026" }, limit: 1) {
      items {
        vendorsCollection {
          items {
            name
            description {
              json
            }
            image {
              ...ImageFields
            }
            logo {
              ...ImageFields
            }
            link
          }
        }
        partnersCollection {
          items {
            name
            description {
              json
            }
            image {
              ...ImageFields
            }
            logo {
              ...ImageFields
            }
            link
          }
        }
        sponsorsCollection {
          items {
            name
            logo {
              ...ImageFields
            }
          }
        }
      }
    }
  }
  ${IMAGE_FRAGMENT}
`;

export const GET_LINEUP_GRAPHICS = gql`
  query getLineupGraphics {
    galleryLineupGraphicsCollection(
      where: { title: "Lineup Graphics" }
      limit: 1
    ) {
      items {
        imageCollection {
          items {
            url
            height
            width
          }
        }
      }
    }
  }
`;

export const GET_FESTIVAL_DATE = gql`
  query getFestivalDate {
    festivalDateCollection(where: { title: "Date" }, limit: 1) {
      items {
        startDate
        endDate
      }
    }
  }
`;

export const GET_VIDEO = gql`
  query getVideo {
    videoCollection(where: { title: "Home Page Video" }, limit: 1) {
      items {
        href
        overlayText {
          json
        }
        image {
          url
          width
          height
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_TILES = gql`
  query getHomePageTiles {
    galleryHomePageTilesCollection(
      where: { title: "Home Page Tiles" }
      limit: 1
    ) {
      items {
        tilesCollection {
          items {
            title
            description
            buttonText
            buttonUrl
            backgroundColor
          }
        }
      }
    }
  }
`;

export const GET_HOME_PAGE_CAROUSEL_ITEMS = gql`
  query getHomePageCarouselItems {
    galleryMediaItemsCollection(
      where: { title: "Home Page Media Slides" }
      limit: 1
    ) {
      items {
        itemsCollection {
          items {
            ... on MediaItem {
              leftText
              rightText
              leftImage {
                url
                width
                height
              }
              rightImage {
                url
                width
                height
              }
            }
          }
        }
      }
    }
  }
`;

export const GET_ARTICLES = gql`
  query getArticles {
    galleryMediaItemsCollection(
      where: { title: "Home Page Articles" }
      limit: 1
    ) {
      total
      items {
        title
        itemsCollection {
          total
          items {
            ... on Article {
              title
              link
              image {
                url
                width
                height
              }
              subtext {
                json
              }
              date
            }
          }
        }
      }
    }
  }
`;
