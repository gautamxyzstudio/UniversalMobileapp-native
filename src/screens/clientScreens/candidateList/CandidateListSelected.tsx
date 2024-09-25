/* eslint-disable react-hooks/exhaustive-deps */
import {Alert, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {verticalScale} from '@utils/metrics';

import {useDispatch, useSelector} from 'react-redux';
import {
  declineShortlistedCandidate,
  openJobsFromState,
  removeFromShortlisted,
  updateShortlistedApplication,
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
import {IC_BLOCK, IC_DENY, IC_REMOVE} from '@assets/exporter';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';

type ICandidateListSelectedProps = {
  jobId: number | null;
};

const CandidateListSelected: React.FC<ICandidateListSelectedProps> = ({
  jobId,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const [refreshing, updateRefreshing] = useState(false);
  const compRef = useRef<BottomSheetModalMethods | null>(null);
  const optionSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const {insetsBottom} = useScreenInsets();
  const toast = useToast();
  const openJobFromState = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const [selectedApplication, setSelectedApplications] = useState<
    Map<number, ICandidateTypes>
  >(new Map());
  const [statusUpdater] = useUpdateJobApplicationStatusMutation();
  const [getShortlistedCandidates, {isFetching}] =
    useLazyGetCandidatesListQuery();
  const [selectedCandidate, setSelectedCandidate] = useState<
    ICandidateTypes | undefined
  >();

  const onPressCandidate = (item: ICandidateTypes) => {
    setSelectedCandidate(item);
    compRef.current?.snapToIndex(1);
  };

  useEffect(() => {
    if (jobId) {
      const job = openJobFromState.find(j => j.id === jobId);
      if (job && job.applicants?.shortlisted) {
        setSelectedApplications(job.applicants.shortlisted);
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

  const onPressBottomSheet = (item: ICandidateTypes) => () => {
    setSelectedCandidate(item);
    optionSheetRef.current?.snapToIndex(1);
  };

  const renderItem = ({item}: {item: ICandidateTypes}) => (
    <CandidateCard
      item={item}
      status={ICandidateStatusEnum.selected}
      onPressThreeDots={onPressBottomSheet(item)}
      onPressCard={onPressCandidate}
    />
  );

  const removeFromShortlistHandler = () =>
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
              removeFromShortlisted({
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

  const declineShortlistedCandidateHandler = () =>
    withAsyncErrorHandlingPost(
      async () => {
        if (selectedCandidate && jobId) {
          optionSheetRef.current?.close();
          const response = await statusUpdater({
            applicationId: selectedCandidate.id,
            status: IJobPostStatus.DECLINED,
          }).unwrap();
          if (response) {
            dispatch(
              declineShortlistedCandidate({
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
            : Array.from(selectedApplication.values())
        }
        renderItem={isFetching ? renderIsLoading : renderItem}
        error={undefined}
        betweenItemSpace={12}
        estimatedItemSize={verticalScale(72.66)}
        onRefresh={getApplications}
        emptyListMessage={STRINGS.no_shortlisted}
        emptyListSubTitle={STRINGS.please_review}
        refreshing={refreshing}
        ListFooterComponentStyle={styles.footer}
        isLastPage={true}
      />
      <CandidateDetailsBottomSheet
        ref={compRef}
        details={selectedCandidate}
        jobStatus={ICandidateStatusEnum.selected}
      />
      <SelectOptionBottomSheet
        modalHeight={verticalScale(280) + insetsBottom}
        ref={optionSheetRef}
        options={[
          {
            icon: IC_REMOVE,
            title: STRINGS.remove_from_shortlist,
            onPress: removeFromShortlistHandler(),
          },
          {
            icon: IC_DENY,
            title: STRINGS.deny,
            onPress: declineShortlistedCandidateHandler(),
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

export default CandidateListSelected;

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
