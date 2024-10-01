/* eslint-disable react-hooks/exhaustive-deps */
import React, {useCallback, useEffect, useState} from 'react';
import {mockJobPostsLoading} from '@api/mockData';
import JobPostCard from './JobPostCard';
import JobPostCardLoading from './JobPostCardLoading';
import CustomList from '@components/molecules/customList';
import {verticalScale} from '@utils/metrics';
import {useLazyGetPostedJobQuery} from '@api/features/client/clientApi';
import {IJobPostTypes} from '@api/features/client/types';
import {NO_INTERNET} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';
import {useDispatch, useSelector} from 'react-redux';
import {
  openJobsFromState,
  saveOpenJobs,
} from '@api/features/client/clientSlice';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {useQuickLinksJobPostContext} from 'src/contexts/quickLinksJobPost';

const ClientOpenJobs = () => {
  const [getJobPosts, {error}] = useLazyGetPostedJobQuery();
  const openJobs = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const user = useSelector(userBasicDetailsFromState);
  const [jobPosts, updateJobPosts] = useState<IJobPostTypes[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);

  const [currentPage, setCurrentPage] = useState(0);

  const {onPressSheet} = useQuickLinksJobPostContext();

  useEffect(() => {
    getJobPostsHandler(true);
  }, []);

  useEffect(() => {
    updateJobPosts(openJobs);
  }, [openJobs]);

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) => (
      <JobPostCard
        onPress={() => onPressSheet('show', 'open', item)}
        {...item}
      />
    ),

    [isLoading, jobPosts],
  );

  const renderItemLoading = () => <JobPostCardLoading />;

  const getJobPostsHandler = withAsyncErrorHandlingGet(
    async (isFirstPage: boolean = false) => {
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 10;
      if (isFirstPage) {
        setIsRefreshing(true);
      }
      const response = await getJobPosts(user?.details?.detailsId).unwrap();
      if (response.data) {
        setIsRefreshing(false);
        setCurrentPage(page);
        setIsLastPage(
          response.data.length === 0 || response.data.length !== perPageRecord,
        );
        dispatch(saveOpenJobs({pageNo: page, jobs: response.data}));
        setIsLoading(false);
      }
    },
    () => {
      setIsRefreshing(false);
      setIsLoading(false);
    },
  );

  const loadMore = () => {
    if (!isLastPage) {
      getJobPostsHandler();
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
        emptyListMessage={STRINGS.no_jobs_posted_yet}
        emptyListIllustration={NO_INTERNET}
        onRefresh={() => getJobPostsHandler(true)}
        emptyListSubTitle={STRINGS.create_job_to_find}
        ListFooterComponentStyle={{height: verticalScale(150)}}
        isLastPage={isLastPage}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
      />
    </>
  );
};

export default ClientOpenJobs;
