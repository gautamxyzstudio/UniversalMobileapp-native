/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import {useDispatch, useSelector} from 'react-redux';
import {
  candidateListFromState,
  updateDeclinedApplications,
} from '@api/features/client/clientSlice';
import {ICandidateTypes} from '@api/features/client/types';
import {useLazyGetCandidatesListQuery} from '@api/features/client/clientApi';
import {ICandidateStatusEnum} from '@utils/enums';
import CustomList from '@components/molecules/customList';
import {mockJobPostsLoading} from '@api/mockData';
import CandidateCard from '@components/client/CandidateCard';
import CandidateCardLoading from '@components/client/CandidateCardLoading';
import {STRINGS} from 'src/locales/english';
import {useUserDetailsViewCandidateListContext} from './UserDetailsViewCandidateList';
import {useCandidateListActionsBottomSheetContext} from './CandidateListActionsBottomSheetContext';
import {IC_NO_DENIED} from '@assets/exporter';

type ICandidateListDeclinedProps = {
  jobId: number | null;
};

const CandidateListDeclined: React.FC<ICandidateListDeclinedProps> = ({
  jobId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [refreshing, updateRefreshing] = useState(false);
  const {onPressThreeDots} = useCandidateListActionsBottomSheetContext();
  const dispatch = useDispatch();
  const candidateJobs = useSelector(candidateListFromState);
  const [declinedApplication, setDeclinedApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [getShortlistedCandidates, {isFetching}] =
    useLazyGetCandidatesListQuery();
  const {onPressSheet} = useUserDetailsViewCandidateListContext();

  useEffect(() => {
    if (jobId) {
      const job = candidateJobs.find(j => j.details.jobId === jobId);
      if (job && job.denied) {
        setDeclinedApplications(job.denied);
      }
    }
  }, [candidateJobs, jobId]);

  useEffect(() => {
    getApplications();
  }, [jobId]);

  const getApplications = async () => {
    if (jobId) {
      try {
        updateRefreshing(true);
        const applicants = await getShortlistedCandidates({
          type: 'denylist',
          jobId,
        }).unwrap();
        if (applicants) {
          dispatch(
            updateDeclinedApplications({
              jobId,
              candidates: applicants,
              pageNumber: 1,
            }),
          );
          updateRefreshing(false);
        }
      } catch (error) {
        updateRefreshing(false);
        console.error(error);
      }
    }
  };

  const renderItem = useCallback(
    ({item}: {item: ICandidateTypes}) => (
      <CandidateCard
        item={item}
        status={ICandidateStatusEnum.declined}
        onPressThreeDots={() =>
          onPressThreeDots('show', jobId ?? 0, 'deny', item)
        }
        onPressCard={() => onPressSheet('show', 'deny', item, jobId ?? 0)}
      />
    ),
    [declinedApplication],
  );

  const renderIsLoading = () => <CandidateCardLoading />;

  return (
    <View style={styles.container}>
      <CustomList
        data={
          isFetching
            ? mockJobPostsLoading
            : Array.from(declinedApplication.values())
        }
        renderItem={isFetching ? renderIsLoading : renderItem}
        error={undefined}
        betweenItemSpace={12}
        estimatedItemSize={verticalScale(72.66)}
        onRefresh={getApplications}
        emptyListIllustration={IC_NO_DENIED}
        emptyListMessage={STRINGS.no_candidates_declined}
        emptyListSubTitle={STRINGS.no_candidates_declined_dec}
        refreshing={refreshing}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />
    </View>
  );
};

export default memo(CandidateListDeclined);

const getStyles = ({}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
    footer: {
      height: verticalScale(100),
    },
  });
  return styles;
};
