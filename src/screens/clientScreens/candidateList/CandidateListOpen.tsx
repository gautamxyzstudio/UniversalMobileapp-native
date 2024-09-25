/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import CandidateCard from '@components/client/CandidateCard';
import CustomList from '@components/molecules/customList';
import CandidateDetailsBottomSheet from './CandidateDetailsBottomSheet';
import {
  useLazyGetCandidatesListQuery,
  useUpdateJobApplicationStatusMutation,
} from '@api/features/client/clientApi';
import CandidateCardLoading from '@components/client/CandidateCardLoading';
import {ICandidateTypes} from '@api/features/client/types';
import {ICandidateStatusEnum, IJobPostStatus} from '@utils/enums';
import {STRINGS} from 'src/locales/english';
import {
  confirmCandidate,
  declineCandidate,
  openJobsFromState,
  updateOpenApplication,
} from '@api/features/client/clientSlice';
import {useDispatch, useSelector} from 'react-redux';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {mockJobPostsLoading} from '@api/mockData';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';

type ICandidateListOpenProps = {
  jobId: number | null;
};

const CandidateListOpen: React.FC<ICandidateListOpenProps> = ({jobId}) => {
  const styles = useThemeAwareObject(getStyles);
  const [isLoading, setIsLoading] = useState(true);
  const compRef = useRef<BottomSheetModalMethods | null>(null);
  const toast = useToast();
  const [refreshing, updateRefreshing] = useState(false);
  const openJobFromState = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const [openApplication, setApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [getOpenRequests] = useLazyGetCandidatesListQuery();
  const [selectedCandidate, setSelectedCandidate] = useState<
    ICandidateTypes | undefined
  >();
  const [statusUpdater] = useUpdateJobApplicationStatusMutation();

  useEffect(() => {
    if (jobId) {
      const job = openJobFromState.find(j => j.id === jobId);
      if (job && job.applicants?.open) {
        setApplications(job.applicants.open);
      }
    }
  }, [openJobFromState, jobId]);

  const onPressCandidate = (item: ICandidateTypes) => {
    setSelectedCandidate(item);
    compRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    getApplications();
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
      } catch (error) {
        setIsLoading(false);
        updateRefreshing(false);
        console.error(error);
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
        onPressCard={onPressCandidate}
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
        error={undefined}
        betweenItemSpace={12}
        estimatedItemSize={verticalScale(72.66)}
        onRefresh={getApplications}
        emptyListMessage={STRINGS.noApplicantsYet}
        emptyListSubTitle={STRINGS.be_the_first}
        refreshing={refreshing}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />
      <CandidateDetailsBottomSheet
        ref={compRef}
        details={selectedCandidate}
        jobStatus={ICandidateStatusEnum.pending}
      />
    </View>
  );
};

export default CandidateListOpen;

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
