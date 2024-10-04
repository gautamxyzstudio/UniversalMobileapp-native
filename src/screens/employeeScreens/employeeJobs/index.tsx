/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import Filters from '@components/molecules/Fiilters';

import CustomList from '@components/molecules/customList';
import {verticalScale} from '@utils/metrics';
import {mockJobPostsLoading} from '@api/mockData';
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
import {useJobDetailsContext} from 'src/contexts/displayJobDetailsContext';
import {jobFilters} from 'src/constants/constants';
import {IJobPostStatus} from '@utils/enums';

const EmployeeJobs = () => {
  const [selectedFilter, setSelectedFilter] = useState<IJobPostStatus | null>(
    null,
  );
  const [fetchJobs, {isFetching, error}] = useLazyFetchAppliedJobsQuery();
  const [jobs, updateJobs] = useState<IJobPostTypes[]>([]);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const appliedJobs = useSelector(appliedJobsFromState);
  const {onPressSheet} = useJobDetailsContext();
  const user = useSelector(userBasicDetailsFromState);

  useEffect(() => {
    fetchAppliedJobsHandler();
  }, [selectedFilter]);

  useEffect(() => {
    updateJobs(appliedJobs);
  }, [appliedJobs]);

  const onPressViewDetails = (details: IJobPostTypes) => {
    onPressSheet('show', details);
  };

  const renderItemListing = useCallback(
    ({item}: {item: IJobPostTypes}) => {
      return <JobPostCard onPress={onPressViewDetails} {...item} />;
    },
    [jobs],
  );

  const renderItemLoading = () => (
    <View>
      <JobPostCardLoading />
    </View>
  );

  const fetchAppliedJobsHandler = withAsyncErrorHandlingGet(
    async () => {
      const appliedJobResponse = await fetchJobs({
        id: user?.details?.detailsId ?? 0,
        type: selectedFilter,
      }).unwrap();
      if (appliedJobResponse) {
        dispatch(updateAppliedJobs(appliedJobResponse));
      }
      setIsRefreshing(false);
    },
    () => {
      setIsRefreshing(false);
    },
  );

  const onRefreshHandler = () => {
    setIsRefreshing(true);
    fetchAppliedJobsHandler(true);
  };

  return (
    <OnBoardingBackground
      childrenStyles={styles.container}
      hideBack
      title={STRINGS.jobs}>
      <Filters
        isLoading={false}
        filters={jobFilters}
        onFilterPress={filter => setSelectedFilter(filter.status)}
        selectedFilter={selectedFilter}
      />
      <View style={styles.customList}>
        <CustomList
          data={isFetching ? mockJobPostsLoading : jobs}
          renderItem={isFetching ? renderItemLoading : renderItemListing}
          getItemType={(item: any) => `${item?.id}`}
          betweenItemSpace={12}
          emptyListMessage={STRINGS.no_jobs_applied}
          emptyListSubTitle={STRINGS.no_jobs_applied_description}
          estimatedItemSize={verticalScale(177)}
          error={error}
          refreshAfterError={onRefreshHandler}
          isRefreshing={isRefreshing}
          onRefresh={onRefreshHandler}
          isLastPage={true}
        />
      </View>
    </OnBoardingBackground>
  );
};

export default EmployeeJobs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingBottom: 0,
  },

  customList: {
    flex: 1,
    marginTop: verticalScale(24),
    paddingHorizontal: verticalScale(24),
    justifyContent: 'center',
  },
});
