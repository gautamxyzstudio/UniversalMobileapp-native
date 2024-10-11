/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import {useDispatch, useSelector} from 'react-redux';
import {
  candidateListFromState,
  updateShortlistedApplication,
} from '@api/features/client/clientSlice';
import {ICandidateTypes} from '@api/features/client/types';
import {useLazyGetCandidatesListQuery} from '@api/features/client/clientApi';
import {ICandidateStatusEnum} from '@utils/enums';
import CustomList from '@components/molecules/customList';
import {mockJobPostsLoading} from '@api/mockData';
import CandidateCard from '@components/client/CandidateCard';
import CandidateCardLoading from '@components/client/CandidateCardLoading';
import {STRINGS} from 'src/locales/english';
import {useCandidateListActionsBottomSheetContext} from './CandidateListActionsBottomSheetContext';
import {useUserDetailsViewCandidateListContext} from './UserDetailsViewCandidateList';
import {IC_NO_SHORTLISTED} from '@assets/exporter';

type ICandidateListSelectedProps = {
  jobId: number | null;
};

const CandidateListSelected: React.FC<ICandidateListSelectedProps> = ({
  jobId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [refreshing, updateRefreshing] = useState(false);
  const {onPressThreeDots} = useCandidateListActionsBottomSheetContext();
  const {onPressSheet} = useUserDetailsViewCandidateListContext();
  const candidateJobs = useSelector(candidateListFromState);
  const dispatch = useDispatch();
  const [selectedApplication, setSelectedApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [getShortlistedCandidates, {isFetching, isError}] =
    useLazyGetCandidatesListQuery();

  useEffect(() => {
    if (jobId) {
      const job = candidateJobs.find(j => j.details.jobId === jobId);
      if (job && job.shortlisted) {
        setSelectedApplications(job.shortlisted);
      }
    }
  }, [jobId, candidateJobs]);

  useEffect(() => {
    getApplications();
  }, [jobId]);

  const getApplications = async () => {
    if (jobId) {
      try {
        updateRefreshing(true);
        const applicants = await getShortlistedCandidates({
          type: 'shortlisted',
          jobId,
        }).unwrap();
        if (applicants) {
          dispatch(
            updateShortlistedApplication({
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
        status={ICandidateStatusEnum.selected}
        onPressThreeDots={() =>
          onPressThreeDots('show', jobId ?? 0, 'shortlisted', item)
        }
        onPressCard={() =>
          onPressSheet('show', 'shortlisted', item, jobId ?? 0)
        }
      />
    ),
    [selectedApplication],
  );

  const renderIsLoading = () => <CandidateCardLoading />;

  return (
    <View style={styles.container}>
      <CustomList
        data={
          isFetching
            ? mockJobPostsLoading
            : Array.from(selectedApplication.values())
        }
        renderItem={isFetching ? renderIsLoading : renderItem}
        error={isError}
        betweenItemSpace={12}
        estimatedItemSize={verticalScale(72.66)}
        onRefresh={getApplications}
        emptyListMessage={STRINGS.no_shortlisted}
        emptyListIllustration={IC_NO_SHORTLISTED}
        emptyListSubTitle={STRINGS.please_review}
        refreshing={refreshing}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />
    </View>
  );
};

export default memo(CandidateListSelected);

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
