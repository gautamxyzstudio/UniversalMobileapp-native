/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLazyGetClosedJobsQuery} from '@api/features/client/clientApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  closedJobsFromState,
  saveClosedJobs,
} from '@api/features/client/clientSlice';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {useNavigation} from '@react-navigation/native';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {IJobPostTypes} from '@api/features/client/types';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import JobPostCard from './JobPostCard';
import JobPostCardLoading from './JobPostCardLoading';
import {withAsyncErrorHandlingGet} from '@utils/constants';
import {mockJobPostsLoading} from '@api/mockData';
import {CHECK_IN, IC_DOCUMENT} from '@assets/exporter';
import CustomList from '@components/molecules/customList';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';

const ClientClosedJobs = () => {
  const [getClosedJobs, {error}] = useLazyGetClosedJobsQuery();
  const closedJobs = useSelector(closedJobsFromState);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const {insetsBottom} = useScreenInsets();
  const user = useSelector(userBasicDetailsFromState);
  const [jobPosts, updateJobPosts] = useState<IJobPostTypes[]>([]);
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);
  const jobDetailsSheetRef = useRef<BottomSheetModal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentSelectedDraft, setCurrentSelectedDraft] =
    useState<IJobPostTypes | null>(null);

  const onPressJobDetails = () => {
    quickActionSheetRef.current?.close();
    setTimeout(() => {
      jobDetailsSheetRef.current?.snapToIndex(1);
    }, 300);
  };

  useEffect(() => {
    geClosedJobsHandler(true);
  }, []);

  const onPressCard = (post: IJobPostTypes) => {
    setCurrentSelectedDraft(post);
    quickActionSheetRef.current?.snapToIndex(1);
  };

  const navigateToCheckIn = () => {
    quickActionSheetRef.current?.close();
    setTimeout(() => {
      navigation.navigate('shortlistedCandidates');
    }, 300);
  };

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) => (
      <JobPostCard onPress={() => onPressCard(item)} {...item} />
    ),

    [isLoading, closedJobs],
  );

  useEffect(() => {
    updateJobPosts(closedJobs);
  }, [closedJobs]);

  const renderItemLoading = () => <JobPostCardLoading />;

  const geClosedJobsHandler = withAsyncErrorHandlingGet(
    async (isFirstPage: boolean = false) => {
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 10;
      if (isFirstPage) {
        setIsRefreshing(true);
      }
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
        onRefresh={() => geClosedJobsHandler(true)}
        emptyListSubTitle={STRINGS.create_job_to_find}
        ListFooterComponentStyle={{height: verticalScale(150)}}
        isLastPage={isLastPage}
        onEndReached={loadMore}
        onEndReachedThreshold={0.2}
      />
      <SelectOptionBottomSheet
        ref={quickActionSheetRef}
        customStyles={styles.container}
        headerTitle={STRINGS.quick_links}
        modalHeight={verticalScale(256) + insetsBottom}
        options={[
          {
            icon: CHECK_IN,
            title: STRINGS.check_in,
            onPress: navigateToCheckIn,
          },
          {
            icon: IC_DOCUMENT,
            title: STRINGS.viewDetails,
            onPress: onPressJobDetails,
          },
        ]}
      />
      <JobDetailsBottomSheet
        ref={jobDetailsSheetRef}
        jobDetails={currentSelectedDraft}
      />
    </>
  );
};

export default ClientClosedJobs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: verticalScale(24),
    paddingVertical: verticalScale(24),
  },
});
