/* eslint-disable react-hooks/exhaustive-deps */
import {Alert, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import {useDispatch, useSelector} from 'react-redux';
import {
  openJobsFromState,
  restoreDeclinedCandidate,
  updateDeclinedApplications,
} from '@api/features/client/clientSlice';
import {ICandidateTypes} from '@api/features/client/types';
import {
  useLazyGetCandidatesListQuery,
  useUpdateJobApplicationStatusMutation,
} from '@api/features/client/clientApi';
import CandidateDetailsBottomSheet from './CandidateDetailsBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {ICandidateStatusEnum, IJobPostStatus} from '@utils/enums';
import CustomList from '@components/molecules/customList';
import {mockJobPostsLoading} from '@api/mockData';
import CandidateCard from '@components/client/CandidateCard';
import CandidateCardLoading from '@components/client/CandidateCardLoading';
import {STRINGS} from 'src/locales/english';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {IC_BLOCK, IC_RESTORE} from '@assets/exporter';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';

type ICandidateListDeclinedProps = {
  jobId: number | null;
};

const CandidateListDeclined: React.FC<ICandidateListDeclinedProps> = ({
  jobId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [refreshing, updateRefreshing] = useState(false);
  const {insetsBottom} = useScreenInsets();
  const compRef = useRef<BottomSheetModalMethods | null>(null);
  const optionSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const openJobFromState = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const [declinedApplication, setDeclinedApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [getShortlistedCandidates, {isFetching}] =
    useLazyGetCandidatesListQuery();
  const [selectedCandidate, setSelectedCandidate] = useState<
    ICandidateTypes | undefined
  >();
  const toast = useToast();
  const [statusUpdater] = useUpdateJobApplicationStatusMutation();
  const onPressCandidate = (item: ICandidateTypes) => {
    setSelectedCandidate(item);
    compRef.current?.snapToIndex(1);
  };

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

  const restoreCandidateHandler = () =>
    withAsyncErrorHandlingPost(
      async () => {
        if (selectedCandidate && jobId) {
          optionSheetRef.current?.close();
          const response = await statusUpdater({
            applicationId: selectedCandidate.id,
            status: IJobPostStatus.APPLIED,
          }).unwrap();
          if (response) {
            dispatch(
              restoreDeclinedCandidate({
                applicant: selectedCandidate,
                jobId: jobId,
              }),
            );
          }
        }
      },
      toast,
      dispatch,
    );

  const onPressBottomSheet = (item: ICandidateTypes) => () => {
    setSelectedCandidate(item);
    optionSheetRef.current?.snapToIndex(1);
  };

  const renderItem = ({item}: {item: ICandidateTypes}) => (
    <CandidateCard
      item={item}
      onPressThreeDots={onPressBottomSheet(item)}
      status={ICandidateStatusEnum.declined}
      onPressCard={onPressCandidate}
    />
  );

  const onPressBlock = () => {
    optionSheetRef.current?.close();
    setTimeout(() => {
      Alert.alert('feature not implemented');
    }, 300);
  };

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
      <CandidateDetailsBottomSheet
        ref={compRef}
        details={selectedCandidate}
        jobStatus={ICandidateStatusEnum.declined}
      />
      <SelectOptionBottomSheet
        modalHeight={208 + insetsBottom}
        ref={optionSheetRef}
        options={[
          {
            icon: IC_RESTORE,
            title: STRINGS.remove_from_shortlist,
            onPress: restoreCandidateHandler(),
          },
          {
            icon: IC_BLOCK,
            title: STRINGS.block,
            onPress: () => onPressBlock(),
          },
        ]}
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
