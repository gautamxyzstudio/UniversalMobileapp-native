/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {memo, useCallback, useEffect, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import CandidateCard from '@components/client/CandidateCard';
import CustomList from '@components/molecules/customList';
import {
  useLazyGetCandidatesListQuery,
  useUpdateJobApplicationStatusMutation,
} from '@api/features/client/clientApi';
import CandidateCardLoading from '@components/client/CandidateCardLoading';
import {ICandidateTypes} from '@api/features/client/types';
import {ICandidateStatusEnum, IJobPostStatus} from '@utils/enums';
import {STRINGS} from 'src/locales/english';
import {
  candidateListFromState,
  confirmCandidate,
  declineCandidate,
  updateOpenApplication,
} from '@api/features/client/clientSlice';
import {useDispatch, useSelector} from 'react-redux';
import {mockJobPostsLoading} from '@api/mockData';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {useUserDetailsViewCandidateListContext} from '@screens/clientScreens/candidateList/UserDetailsViewCandidateList';
import {IC_NO_APPLICATIONS} from '@assets/exporter';

type ICandidateListOpenProps = {
  jobId: number | null;
};

const CandidateListOpen: React.FC<ICandidateListOpenProps> = ({jobId}) => {
  const styles = useThemeAwareObject(getStyles);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const candidateJobs = useSelector(candidateListFromState);
  const {onPressSheet} = useUserDetailsViewCandidateListContext();
  const [refreshing, updateRefreshing] = useState(false);
  const dispatch = useDispatch();
  const [openApplication, setApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [getOpenRequests, {error}] = useLazyGetCandidatesListQuery();
  const [statusUpdater] = useUpdateJobApplicationStatusMutation();

  useEffect(() => {
    if (jobId) {
      const job = candidateJobs.find(j => j.details.jobId === jobId);
      if (job && job.open) {
        console.log(job.open, 'open application are there');
        setApplications(job.open);
      }
    }
  }, [candidateJobs, jobId]);

  useEffect(() => {
    if (jobId) {
      getApplications();
    }
  }, [jobId]);

  const acceptCandidateApplication = (item: ICandidateTypes) =>
    withAsyncErrorHandlingPost(
      async () => {
        const response = await statusUpdater({
          applicationId: item.id,
          status: IJobPostStatus.CONFIRMED,
        }).unwrap();
        if (response) {
          if (jobId) {
            dispatch(confirmCandidate({applicant: item, jobId: jobId}));
            console.log(response, 'confirm');
          }
        }
      },
      toast,
      dispatch,
    );

  const declineCandidateApplication = (item: ICandidateTypes) =>
    withAsyncErrorHandlingPost(
      async () => {
        const response = await statusUpdater({
          applicationId: item.id,
          status: IJobPostStatus.DECLINED,
        }).unwrap();
        if (response) {
          if (jobId) {
            dispatch(declineCandidate({applicant: item, jobId: jobId}));
            console.log(response);
          }
        }
      },
      toast,
      dispatch,
    );

  const getApplications = async () => {
    if (jobId) {
      try {
        setIsLoading(true);
        updateRefreshing(true);
        const applicants = await getOpenRequests({
          type: 'open',
          jobId,
        }).unwrap();
        if (applicants) {
          setIsLoading(false);
          dispatch(
            updateOpenApplication({
              jobId,
              candidates: applicants,
              pageNumber: 1,
            }),
          );
          updateRefreshing(false);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
        updateRefreshing(false);
      }
    }
  };

  const renderItem = useCallback(
    ({item}: {item: ICandidateTypes}) => (
      <CandidateCard
        item={item}
        status={ICandidateStatusEnum.pending}
        onPressAccept={acceptCandidateApplication(item)}
        onPressDecline={declineCandidateApplication(item)}
        onPressCard={() =>
          onPressSheet('show', 'applications', item, jobId ?? 0)
        }
      />
    ),
    [openApplication],
  );

  const renderIsLoading = () => <CandidateCardLoading />;

  return (
    <View style={styles.container}>
      <CustomList
        data={
          isLoading ? mockJobPostsLoading : Array.from(openApplication.values())
        }
        renderItem={isLoading ? renderIsLoading : renderItem}
        error={error}
        betweenItemSpace={12}
        estimatedItemSize={verticalScale(72.66)}
        onRefresh={getApplications}
        emptyListMessage={STRINGS.noApplicantsYet}
        emptyListIllustration={IC_NO_APPLICATIONS}
        emptyListSubTitle={STRINGS.be_the_first}
        refreshing={refreshing}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />
    </View>
  );
};

export default memo(CandidateListOpen);

const getStyles = ({}: Theme) => {
  return StyleSheet.create({
    container: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
    footer: {
      height: verticalScale(100),
    },
  });
};
