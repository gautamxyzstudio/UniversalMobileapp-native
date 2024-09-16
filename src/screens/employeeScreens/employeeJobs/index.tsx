import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import Filters, {IFilter} from '@components/molecules/Fiilters';

import {getJobStatus} from './types';
import CustomList from '@components/molecules/customList';
import JobCard, {IJobDetailsPropTypes} from '@components/employee/JobCard';
import {verticalScale} from '@utils/metrics';
import {mockJobFilters, mockJobPostsLoading, userMockJobs} from '@api/mockData';
import {useLazyFetchAppliedJobsQuery} from '@api/features/employee/employeeApi';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {useDispatch, useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {IJobPostTypes} from '@api/features/client/types';
import JobPostCard from '@components/client/JobPostCard';
import JobPostCardLoading from '@components/client/JobPostCardLoading';
import {
  appliedJobsFromState,
  updateAppliedJobs,
} from '@api/features/employee/employeeSlice';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {IJobTypes} from '@api/features/employee/types';

const EmployeeJobs = () => {
  const [selectedFilterId, setSelectedFilterId] = useState(0);
  const [fetchJobs, {isLoading, error}] = useLazyFetchAppliedJobsQuery();
  const [jobs, updateJobs] = useState<IJobPostTypes[]>([]);
  const dispatch = useDispatch();
  const [currentSelectedJob, setCurrentSelectedJob] =
    useState<IJobPostTypes | null>(null);
  const jobDetailsSheetRef = useRef<BottomSheetModal | null>(null);
  const appliedJobs = useSelector(appliedJobsFromState);
  const user = useSelector(userBasicDetailsFromState);
  const [filters, setFilters] = useState<IFilter[]>([
    {id: 0, value: STRINGS.all},
  ]);

  useEffect(() => {
    fetchAppliedJobsHandler();
  }, []);

  useEffect(() => {
    updateJobs(appliedJobs);
  }, [appliedJobs]);

  useEffect(() => {
    if (filters.length < 2) {
      const newFilters = mockJobFilters.map(item => ({
        id: item.id,
        value: getJobStatus(item.status),
      }));

      setFilters(prevFilters => [...prevFilters, ...newFilters]);
    }
  }, [filters.length]);

  const viewJobDetailsHandler = (jobDetails: IJobTypes) => {
    setCurrentSelectedJob(jobDetails);
    jobDetailsSheetRef.current?.snapToIndex(1);
  };

  const renderItemListing = useCallback(({item}: {item: IJobPostTypes}) => {
    console.log(item.status, 'STATUS');
    return (
      <JobPostCard onPress={() => viewJobDetailsHandler(item)} {...item} />
    );
  }, []);

  const renderItemLoading = ({index}: {index: number}) => (
    <View>
      <JobPostCardLoading />
    </View>
  );

  const fetchAppliedJobsHandler = withAsyncErrorHandlingGet(async () => {
    const appliedJobResponse = await fetchJobs(
      user?.details?.detailsId ?? 0,
    ).unwrap();
    if (appliedJobResponse) {
      dispatch(updateAppliedJobs(appliedJobResponse));
    }
  });

  return (
    <OnBoardingBackground
      childrenStyles={styles.container}
      hideBack
      title={STRINGS.jobs}>
      <Filters
        filters={filters}
        onFilterPress={filter => setSelectedFilterId(filter.id)}
        selectedFilterId={selectedFilterId}
      />
      <View style={styles.customList}>
        <CustomList
          data={isLoading ? mockJobPostsLoading : jobs}
          renderItem={isLoading ? renderItemLoading : renderItemListing}
          getItemType={(item: any) => `${item?.id}`}
          betweenItemSpace={12}
          emptyListMessage={STRINGS.no_jobs_applied}
          emptyListSubTitle={STRINGS.no_jobs_applied_description}
          estimatedItemSize={verticalScale(177)}
          error={error}
          isLastPage={true}
        />
        <JobDetailsBottomSheet
          ref={jobDetailsSheetRef}
          jobDetails={currentSelectedJob}
        />
      </View>
    </OnBoardingBackground>
  );
};

export default EmployeeJobs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },

  customList: {
    flex: 1,
    marginTop: verticalScale(24),
    paddingHorizontal: verticalScale(24),
    justifyContent: 'center',
  },
});
