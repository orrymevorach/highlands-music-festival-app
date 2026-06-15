import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@apollo/client';
import Layout from 'components/shared/Layout/Layout';
import PricingContainer from './PricingContainer/PricingContainer';
import ArtistAnnouncement from './ArtistAnnouncement/ArtistAnnouncement';
import { FEATURE_FLAGS } from 'utils/constants';
import { GET_FEATURE_FLAG, GET_LINEUP_AND_SCHEDULE } from 'contentful/queries';

export default function Home() {
  const headlinerFeatureFlagResponse = useQuery(GET_FEATURE_FLAG, {
    variables: {
      name: FEATURE_FLAGS.HEADLINER_ANNOUNCEMENT,
    },
  });
  const headlinerFeatureFlag = Boolean(
    headlinerFeatureFlagResponse.data?.featureFlagCollection?.items?.[0]?.value,
  );

  const headlineTransitionPeriodFeatureFlagResponse = useQuery(
    GET_FEATURE_FLAG,
    {
      variables: {
        name: FEATURE_FLAGS.IS_FESTIVAL_TRANSITION_PERIOD,
      },
    },
  );

  const headlineTransitionPeriodFeatureFlag = Boolean(
    headlineTransitionPeriodFeatureFlagResponse.data?.featureFlagCollection
      ?.items?.[0]?.value,
  );

  const headlinersResponse = useQuery(GET_LINEUP_AND_SCHEDULE);
  const headliners =
    headlinersResponse.data?.lineupCollection?.items?.[0]
      ?.headlinersCollection?.items || [];

  return (
    <Layout scroll paddingHorizontal={0}>
      <PricingContainer />
      {headlinerFeatureFlag && (
        <ArtistAnnouncement
          headliners={headliners}
          headlineTransitionPeriodFeatureFlag={
            headlineTransitionPeriodFeatureFlag
          }
        />
      )}
    </Layout>
  );
}
