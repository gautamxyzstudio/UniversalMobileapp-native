/* eslint-disable react-hooks/exhaustive-deps */
import {Alert, StyleSheet, View} from 'react-native';
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

const EmployeeJobs = () => {
  const [selectedFilterId, setSelectedFilterId] = useState(1);
  const [fetchJobs, {isLoading, error}] = useLazyFetchAppliedJobsQuery();
  const [jobs, updateJobs] = useState<IJobPostTypes[]>([]);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const appliedJobs = useSelector(appliedJobsFromState);
  const {onPressSheet} = useJobDetailsContext();
  const user = useSelector(userBasicDetailsFromState);

  useEffect(() => {
    fetchAppliedJobsHandler();
  }, []);

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
      const appliedJobResponse = await fetchJobs(
        user?.details?.detailsId ?? 0,
      ).unwrap();
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
        isLoading={isLoading}
        filters={jobFilters}
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
