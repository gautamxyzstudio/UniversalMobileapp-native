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
import {useDispatch, useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {mockJobPostsLoading, provincesAndCities} from '@api/mockData';
import {useLazyFetchJobsQuery} from '@api/features/employee/employeeApi';
import {jobsFromState, updateJobs} from '@api/features/employee/employeeSlice';
import HomeListHeaderView from '@components/employee/HomeListHeaderView';
import {STRINGS} from 'src/locales/english';
import JobPostCard from '@components/client/JobPostCard';
import {IJobTypes} from '@api/features/employee/types';
import JobPostCardLoading from '@components/client/JobPostCardLoading';
import {useJobDetailsContext} from 'src/contexts/displayJobDetailsContext';
import {IJobPostTypes} from '@api/features/client/types';
import {IC_EMPTY_JOBS_LIST} from '@assets/exporter';

const EmployeeHome = () => {
  const styles = useThemeAwareObject(getStyles);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const user = useSelector(userBasicDetailsFromState);
  const scrollY = useSharedValue(0);
  const [getJobs, {isLoading, error}] = useLazyFetchJobsQuery();
  const jobsInState = useSelector(jobsFromState);
  const {onPressSheet} = useJobDetailsContext();
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  useEffect(() => {
    getJobsPosts(true);
  }, []);

  useEffect(() => {
    if (jobsInState) {
      setJobs(jobsInState);
    }
  }, [jobsInState]);

  const onPressViewDetails = (details: IJobPostTypes) => {
    onPressSheet('show', details);
  };

  const getJobsPosts = async (isFirstPage: boolean = false) => {
    try {
      let page = isFirstPage ? 1 : currentPage + 1;
      const usersJobsResponse = await getJobs(page).unwrap();
      if (usersJobsResponse) {
        dispatch(
          updateJobs({
            currentPage: page,
            jobs: usersJobsResponse.data,
            detailsId: user?.details?.detailsId ?? 0,
          }),
        );
        setIsRefreshing(false);
        setCurrentPage(page);
        setIsLastPage(page === usersJobsResponse.pagination.total);
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

  const renderItemLoading = () => (
    <View style={styles.list}>
      <JobPostCardLoading />
    </View>
  );

  const renderItemListing = useCallback(
    ({item}: {item: IJobTypes}) => (
      <View style={styles.list}>
        <JobPostCard onPress={() => onPressViewDetails(item)} {...item} />
      </View>
    ),
    [isLoading, jobs],
  );

  const onRefreshHandler = () => {
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
          emptyListIllustration={IC_EMPTY_JOBS_LIST}
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
