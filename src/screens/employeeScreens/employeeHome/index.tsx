/* eslint-disable react-hooks/exhaustive-deps */
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import HomeTopView from '@components/employee/HomeTopView';
import {verticalScale} from '@utils/metrics';
import {useSharedValue} from 'react-native-reanimated';
import CustomList from '@components/molecules/customList';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useLazyGetUserQuery} from '@api/features/user/userApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateEmployeeDetails,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IEmployeeDetails} from '@api/features/user/types';
import {mockJobPostsLoading, provincesAndCities} from '@api/mockData';
import {
  useApplyForJobMutation,
  useLazyFetchJobsQuery,
} from '@api/features/employee/employeeApi';
import {
  applyJobAction,
  jobsFromState,
  updateJobs,
} from '@api/features/employee/employeeSlice';
import HomeListHeaderView from '@components/employee/HomeListHeaderView';
import {STRINGS} from 'src/locales/english';
import JobPostCard from '@components/client/JobPostCard';
import {IJobTypes} from '@api/features/employee/types';
import JobPostCardLoading from '@components/client/JobPostCardLoading';
import JobDetailsBottomSheet from '@components/employee/JobDetailsBottomSheet';
import {IJobPostTypes} from '@api/features/client/types';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {IJobPostStatus} from '@utils/enums';
import {showToast} from '@components/organisms/customToast';

const EmployeeHome = () => {
  const styles = useThemeAwareObject(getStyles);
  const [jobs, setJobs] = useState<any[]>([]);
  const toast = useToast();
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = useSelector(userBasicDetailsFromState);
  const scrollY = useSharedValue(0);
  const [currentSelectedJob, setCurrentSelectedJob] =
    useState<IJobPostTypes | null>(null);
  const [getUserDetails] = useLazyGetUserQuery();
  const [applyForJob] = useApplyForJobMutation();
  const [getJobs, {isLoading, error}] = useLazyFetchJobsQuery();
  const jobsInState = useSelector(jobsFromState);
  const jobDetailsSheetRef = useRef<BottomSheetModal | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  useEffect(() => {
    getUser();
    getJobsPosts(true);
  }, []);

  console.log(jobsInState, 'State_jobs');

  useEffect(() => {
    if (jobsInState) {
      setJobs(jobsInState);
    }
  }, [jobsInState]);

  const getUser = async () => {
    try {
      const userDetailsResponse = await getUserDetails(null).unwrap();
      if (user?.user_type === 'emp') {
        const details = userDetailsResponse as IEmployeeDetails;
        dispatch(updateEmployeeDetails(details));
      }
    } catch (err) {
      console.log(err, 'ERROR GETTING USER DETAILS');
    }
  };

  const onPressJobHandler = withAsyncErrorHandlingPost(
    async () => {
      jobDetailsSheetRef.current?.close();
      if (currentSelectedJob?.id && user?.id) {
        const applyJobResponse = await applyForJob({
          data: {
            jobs: currentSelectedJob?.id,
            applicationDate: new Date(),
            status: IJobPostStatus.APPLIED,
            employee_details: user.details?.detailsId ?? 0,
          },
        }).unwrap();
        if (applyJobResponse) {
          showToast(toast, STRINGS.job_applied_successfully, 'success');
          if (currentSelectedJob !== null) {
            dispatch(
              applyJobAction({
                ...currentSelectedJob,
                status: IJobPostStatus.APPLIED,
              }),
            );
          }
        }
      }
    },
    toast,
    dispatch,
  );

  const getJobsPosts = async (isFirstPage: boolean = false) => {
    try {
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 10;
      const usersJobsResponse = await getJobs(page).unwrap();
      if (usersJobsResponse) {
        dispatch(updateJobs({currentPage: page, jobs: usersJobsResponse.data}));
        setIsRefreshing(false);
        setCurrentPage(page);
        setIsLastPage(
          usersJobsResponse.data.length === 0 ||
            usersJobsResponse.data.length !== perPageRecord,
        );
      }
    } catch (err) {
      setIsRefreshing(false);
      console.log(err, 'ERROR GETTING JOB POSTS');
    }
  };

  const loadMore = () => {
    if (!isLastPage) {
      getJobsPosts();
    }
  };

  const viewJobDetailsHandler = (jobDetails: IJobTypes) => {
    setCurrentSelectedJob(jobDetails);
    jobDetailsSheetRef.current?.snapToIndex(1);
  };

  const renderItemLoading = () => (
    <View style={styles.list}>
      <JobPostCardLoading />
    </View>
  );

  const renderItemListing = useCallback(
    ({item}: {item: IJobTypes}) => (
      <View style={styles.list}>
        <JobPostCard onPress={() => viewJobDetailsHandler(item)} {...item} />
      </View>
    ),
    [isLoading, jobs],
  );

  const onRefreshHandler = () => {
    setCurrentPage(1);
    setIsRefreshing(true);
    getJobsPosts(true);
  };

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
  };

  return (
    <View style={styles.container}>
      <HomeTopView height={scrollY} onPress={displayModal} />
      <View style={styles.containerList}>
        <CustomList
          data={isLoading ? mockJobPostsLoading : jobs}
          onScroll={onScroll}
          renderItem={isLoading ? renderItemLoading : renderItemListing}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={
            <View style={styles.headingView}>
              <HomeListHeaderView
                title={STRINGS.jobListing}
                displayRightArrow={false}
              />
            </View>
          }
          getItemType={(item: any) => `${item?.id}`}
          estimatedItemSize={verticalScale(177)}
          betweenItemSpace={verticalScale(12)}
          ListFooterComponent={<View />}
          ListFooterComponentStyle={styles.footer}
          error={error}
          emptyListMessage={STRINGS.no_jobs_available}
          emptyListSubTitle={STRINGS.no_jobs_available_description}
          onEndReached={loadMore}
          onRefresh={onRefreshHandler}
          isRefreshing={isRefreshing}
          onEndReachedThreshold={0.1}
          isLastPage={isLastPage}
        />
      </View>
      <FilterListBottomSheet
        ref={bottomSheetRef}
        filters={provincesAndCities}
        snapPoints={[0.01, verticalScale(698)]}
        getAppliedFilters={() => console.log('Applied filters')}
      />
      <JobDetailsBottomSheet
        ref={jobDetailsSheetRef}
        onPressApply={onPressJobHandler}
        jobDetails={currentSelectedJob}
      />
    </View>
  );
};

export default EmployeeHome;
const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: color.backgroundWhite,
    },
    containerList: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
    mainView: {marginTop: verticalScale(24)},

    scrollView: {},
    content: {
      flexGrow: 1,
    },
    marginLeft: {
      marginLeft: verticalScale(10),
      marginVertical: 1,
    },
    spacer: {
      width: verticalScale(24),
    },
    list: {
      marginHorizontal: verticalScale(24),
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      width: verticalScale(24),
    },
    headerSeparator: {
      width: verticalScale(12),
    },
    headingView: {
      // paddingTop: verticalScale(16),
      // paddingBottom: verticalScale(16),
      backgroundColor: color.backgroundWhite,
    },
    footer: {
      height: verticalScale(150),
    },
  });
  return styles;
};
