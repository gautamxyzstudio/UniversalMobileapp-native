/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import {useDispatch, useSelector} from 'react-redux';
import {
  openJobsFromState,
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

type ICandidateListDeclinedProps = {
  jobId: number | null;
};

const CandidateListDeclined: React.FC<ICandidateListDeclinedProps> = ({
  jobId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [refreshing, updateRefreshing] = useState(false);
  const openJobFromState = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const [declinedApplication, setDeclinedApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [getShortlistedCandidates, {isFetching}] =
    useLazyGetCandidatesListQuery();
  const {onPressSheet} = useUserDetailsViewCandidateListContext();
  useEffect(() => {
    if (jobId) {
      const job = openJobFromState.find(j => j.id === jobId);
      if (job && job.applicants?.denied) {
        setDeclinedApplications(job.applicants.denied);
      }
    }
  }, [openJobFromState, jobId]);

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
        onPressCard={() => onPressSheet('show', 'deny', item)}
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
        emptyListMessage={STRINGS.no_candidates_declined}
        refreshing={refreshing}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />
    </View>
  );
};

export default CandidateListDeclined;

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
