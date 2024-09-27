/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {mockJobPostsLoading} from '@api/mockData';
import JobPostCard from './JobPostCard';
import JobPostCardLoading from './JobPostCardLoading';
import CustomList from '@components/molecules/customList';
import {verticalScale} from '@utils/metrics';
import {
  useLazyGetPostedJobQuery,
  useStopAJobPostMutation,
} from '@api/features/client/clientApi';
import {IJobPostTypes} from '@api/features/client/types';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {
  CHECK_IN,
  IC_DOCUMENT,
  NO_INTERNET,
  PAUSE,
  PERSON_SECONDARY,
} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';
import {useDispatch, useSelector} from 'react-redux';
import {
  openJobsFromState,
  saveOpenJobs,
  stopAJobPostReducer,
} from '@api/features/client/clientSlice';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {
  withAsyncErrorHandlingGet,
  withAsyncErrorHandlingPost,
} from '@utils/constants';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import {useNavigation} from '@react-navigation/native';
import {clientTabBarRoutes} from 'src/navigator/types';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {useToast} from 'react-native-toast-notifications';
import {showToast} from '@components/organisms/customToast';

const ClientOpenJobs = () => {
  const [getJobPosts, {error}] = useLazyGetPostedJobQuery();
  const openJobs = useSelector(openJobsFromState);
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const toast = useToast();
  const {insetsBottom} = useScreenInsets();
  const user = useSelector(userBasicDetailsFromState);
  const [jobPosts, updateJobPosts] = useState<IJobPostTypes[]>([]);
  const quickActionSheetRef = useRef<BottomSheetModal | null>(null);
  const jobDetailsSheetRef = useRef<BottomSheetModal | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [stopAJobPost] = useStopAJobPostMutation();
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSelectedDraft, setCurrentSelectedDraft] =
    useState<IJobPostTypes | null>(null);

  const onPressJobDetails = () => {
    quickActionSheetRef.current?.close();
    setTimeout(() => {
      jobDetailsSheetRef.current?.snapToIndex(1);
    }, 300);
  };

  useEffect(() => {
    getJobPostsHandler(true);
  }, []);

  const onPressCard = (post: IJobPostTypes) => {
    setCurrentSelectedDraft(post);
    quickActionSheetRef.current?.snapToIndex(1);
  };

  const stopAJobHandler = () =>
    withAsyncErrorHandlingPost(
      async () => {
        quickActionSheetRef.current?.close();
        if (currentSelectedDraft) {
          const response = await stopAJobPost({
            jobId: currentSelectedDraft.id,
          }).unwrap();
          if (response) {
            if (currentSelectedDraft) {
              dispatch(stopAJobPostReducer({jobId: currentSelectedDraft.id}));
              showToast(toast, STRINGS.job_closed_success, 'success');
              console.log(response);
            }
          }
        }
      },
      toast,
      dispatch,
    );

  const navigateToCheckIn = () => {
    quickActionSheetRef.current?.close();
    setTimeout(() => {
      navigation.navigate('shortlistedCandidates');
    }, 300);
  };

  useEffect(() => {
    updateJobPosts(openJobs);
  }, [openJobs]);

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) => (
      <JobPostCard onPress={() => onPressCard(item)} {...item} />
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

  const onPressViewApplicants = () => {
    quickActionSheetRef.current?.close();
    navigation.navigate('clientTabBar', {
      screen: clientTabBarRoutes.contactList,
      params: {jobId: currentSelectedDraft?.id},
    });
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

      <SelectOptionBottomSheet
        ref={quickActionSheetRef}
        customStyles={styles.container}
        headerTitle={STRINGS.quick_links}
        modalHeight={verticalScale(400) + insetsBottom}
        options={[
          {
            icon: CHECK_IN,
            title: STRINGS.check_in,
            onPress: navigateToCheckIn,
          },
          {
            icon: PERSON_SECONDARY,
            title: STRINGS.viewApplicants,
            onPress: onPressViewApplicants,
          },
          {
            icon: IC_DOCUMENT,
            title: STRINGS.viewDetails,
            onPress: onPressJobDetails,
          },
          {
            icon: PAUSE,
            title: STRINGS.stop,
            onPress: stopAJobHandler(),
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

export default ClientOpenJobs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: verticalScale(24),
    paddingVertical: verticalScale(24),
  },
});
