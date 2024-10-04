/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {useLazyGetClosedJobsQuery} from '@api/features/client/clientApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  closedJobsFromState,
  saveClosedJobs,
} from '@api/features/client/clientSlice';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {IJobPostTypes} from '@api/features/client/types';
import JobPostCard from './JobPostCard';
import JobPostCardLoading from './JobPostCardLoading';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {mockJobPostsLoading} from '@api/mockData';
import {IC_NO_CLOSED} from '@assets/exporter';
import CustomList from '@components/molecules/customList';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {useQuickLinksJobPostContext} from 'src/contexts/quickLinksJobPost';

const ClientClosedJobs = () => {
  const [getClosedJobs, {error}] = useLazyGetClosedJobsQuery();
  const closedJobs = useSelector(closedJobsFromState);
  const dispatch = useDispatch();

  const user = useSelector(userBasicDetailsFromState);
  const [jobPosts, updateJobPosts] = useState<IJobPostTypes[]>([]);
  const {onPressSheet} = useQuickLinksJobPostContext();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    geClosedJobsHandler(true);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) => (
      <JobPostCard
        onPress={() => onPressSheet('show', 'closed', item)}
        {...item}
      />
    ),

    [isLoading, closedJobs],
  );

  useEffect(() => {
    updateJobPosts(closedJobs);
  }, [closedJobs]);

  const renderItemLoading = () => <JobPostCardLoading />;

  const onRefreshHandler = () => {
    setCurrentPage(1);
    setIsRefreshing(true);
    geClosedJobsHandler(true);
  };

  const geClosedJobsHandler = withAsyncErrorHandlingGet(
    async (isFirstPage: boolean = false) => {
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 10;
      const response = await getClosedJobs(user?.details?.detailsId).unwrap();
      if (response.data) {
        setIsRefreshing(false);
        setCurrentPage(page);
        setIsLastPage(
          response.data.length === 0 || response.data.length !== perPageRecord,
        );
        dispatch(saveClosedJobs({pageNo: page, jobs: response.data}));
        setIsLoading(false);
      }
    },
    () => {
      setIsRefreshing(false);
      updateJobPosts([]);
      setIsLoading(false);
    },
  );

  const loadMore = () => {
    if (!isLastPage) {
      geClosedJobsHandler();
    }
  };

  return (
    <>
      <CustomList
        data={isLoading ? mockJobPostsLoading : jobPosts}
        estimatedItemSize={verticalScale(220)}
        renderItem={isLoading ? renderItemLoading : renderItem}
        error={error}
        getItemType={item => item.id}
        isRefreshing={isRefreshing}
        emptyListMessage={STRINGS.no_completed_jobs_posted_yet}
        onRefresh={onRefreshHandler}
        emptyListIllustration={IC_NO_CLOSED}
        emptyListSubTitle={STRINGS.create_job_to_find}
        ListFooterComponentStyle={{height: verticalScale(150)}}
        isLastPage={isLastPage}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
      />
    </>
  );
};

export default ClientClosedJobs;
