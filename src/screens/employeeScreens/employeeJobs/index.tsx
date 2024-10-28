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
import {IJobPostStatus} from '@utils/enums';
import {IC_EMPTY_APPLIED} from '@assets/exporter';

const EmployeeJobs = () => {
  const [selectedFilter, setSelectedFilter] = useState<IJobPostStatus | null>(
    null,
  );
  const [fetchJobs, {error}] = useLazyFetchAppliedJobsQuery();
  const [isFetching, setIsFetching] = useState(true);
  const [jobs, updateJobs] = useState<IJobPostTypes[]>([]);
  const dispatch = useDispatch();
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const appliedJobs = useSelector(appliedJobsFromState);
  const {onPressSheet} = useJobDetailsContext();
  const user = useSelector(userBasicDetailsFromState);

  useEffect(() => {
    setIsFetching(true);
    fetchAppliedJobsHandler(true);
  }, [selectedFilter]);

  useEffect(() => {
    updateJobs(appliedJobs);
  }, [appliedJobs]);

  const fetchAppliedJobsHandler = withAsyncErrorHandlingGet(
    async (isFirstPage: boolean = false) => {
      let page = isFirstPage ? 1 : currentPage + 1;
      const appliedJobResponse = await fetchJobs({
        id: user?.details?.detailsId ?? 0,
        type: selectedFilter,
        page,
      }).unwrap();
      if (appliedJobResponse) {
        setIsFetching(false);
        dispatch(
          updateAppliedJobs({data: appliedJobResponse.data, currentPage: page}),
        );
        setIsRefreshing(false);
        setCurrentPage(page);
        setIsLastPage(
          appliedJobResponse.data.length === 0 ||
            page === appliedJobResponse?.pagination?.pageCount,
        );
      }
    },
    () => {
      setIsRefreshing(false);
    },
  );

  const onRefreshHandler = () => {
    setIsRefreshing(true);
    fetchAppliedJobsHandler(true);
  };

  const loadMore = () => {
    if (!isLastPage) {
      fetchAppliedJobsHandler();
    }
  };

  const renderItemListing = useCallback(
    ({item}: {item: IJobPostTypes}) => {
      return <JobPostCard onPress={() => onPressViewDetails(item)} {...item} />;
    },
    [jobs],
  );

  const onPressViewDetails = (details: IJobPostTypes) => {
    onPressSheet('show', details);
  };

  const renderItemLoading = () => (
    <View>
      <JobPostCardLoading />
    </View>
  );

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
          emptyListIllustration={IC_EMPTY_APPLIED}
          estimatedItemSize={verticalScale(177)}
          error={error}
          refreshAfterError={onRefreshHandler}
          isRefreshing={isRefreshing}
          onEndReached={loadMore}
          onRefresh={onRefreshHandler}
          isLastPage={isLastPage}
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
