import Layout from 'components/shared/Layout/Layout';
import { useQuery } from '@apollo/client';
import { FEATURE_FLAGS } from 'utils/constants';
import {
  GET_FEATURE_FLAG,
  GET_LINEUP_AND_SCHEDULE,
  GET_LINEUP_GRAPHICS,
} from 'contentful/queries';
import SectionHeading from 'components/shared/SectionHeading/SectionHeading';
import Lineup from './Lineup/Lineup';
import PastLineups from './PastLineups/PastLineups';
import Schedule from './Schedule/Schedule';

export default function LineupAndSchedule() {
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

  const lineupResponse = useQuery(GET_LINEUP_AND_SCHEDULE);
  const lineup = lineupResponse.data?.lineupCollection?.items?.[0] || {};
  const lineupGraphicsResponse = useQuery(GET_LINEUP_GRAPHICS);
  const lineupGraphics =
    lineupGraphicsResponse.data?.galleryLineupGraphicsCollection?.items?.[0]
      ?.imageCollection?.items || [];
  const scheduleGraphics =
    lineup.scheduleCollection &&
    lineup.scheduleCollection.items &&
    lineup.scheduleCollection.items.length
      ? lineup.scheduleCollection.items
      : null;

  return (
    <Layout scroll paddingHorizontal={0}>
      {!headlineTransitionPeriodFeatureFlag ? (
        <>
          <Lineup lineup={lineup} lineupGraphics={lineupGraphics} />
          {scheduleGraphics && <Schedule scheduleGraphics={scheduleGraphics} />}
        </>
      ) : (
        <SectionHeading isSmall isBlue>
          2026 Lineup Coming Soon...
        </SectionHeading>
      )}
      <PastLineups lineupGraphics={lineupGraphics} />
    </Layout>
  );
}
