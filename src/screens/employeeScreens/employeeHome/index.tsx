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
import {
  HomeFilters,
  mockJobPostsLoading,
  provincesAndCities,
} from '@api/mockData';
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
import {setLoading} from '@api/features/loading/loadingSlice';
import {dateFormatterRev} from '@utils/utils.common';
import {Row} from '@components/atoms/Row';
import EmployeeHomeChip from '@components/employee/EmployeeHomeChip';

const EmployeeHome = () => {
  //States initializations
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
  const [jobType, setJobType] = useState<'event' | 'static' | null>(null);
  const {onPressSheet} = useJobDetailsContext();
  const [filterDate, setFilterDate] = useState<{
    startDate: string | null;
    endDate: string | null;
  }>({
    startDate: null,
    endDate: null,
  });
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const homeFilterSheetRef = useRef<BottomSheetModal | null>(null);
  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  // to get job posts in case of filter applied
  useEffect(() => {
    dispatch(setLoading(true));
    setIsLastPage(true);
    getJobsPosts(true);
  }, [jobType, filterDate.startDate, filterDate.endDate]);

  // to set the data after from redux after  api call
  useEffect(() => {
    if (jobsInState) {
      setJobs(jobsInState);
    }
  }, [jobsInState, filterDate]);

  // handling last page in case redux data was zero
  useEffect(() => {
    if (
      jobsInState.length === 0 ||
      totalPages === 0 ||
      currentPage === totalPages
    ) {
      setIsLastPage(true);
    }
  }, [jobsInState, currentPage]);

  // to view job details
  const onPressViewDetails = (details: IJobPostTypes) => {
    onPressSheet('show', details);
  };

  //api to get job posts
  const getJobsPosts = async (isFirstPage: boolean = false) => {
    try {
      let page = isFirstPage ? 1 : currentPage + 1;
      const usersJobsResponse = await getJobs({
        pageNumber: page,
        event: jobType,
        startDate: filterDate.startDate,
        endDate: filterDate.endDate,
      }).unwrap();
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
        setTotalPages(usersJobsResponse.pagination.total);
        setIsLastPage(
          () =>
            usersJobsResponse.pagination.total === 0 ||
            page === usersJobsResponse.pagination.total,
        );
      }
    } catch (err) {
      setIsRefreshing(false);
      console.log(err, 'ERROR GETTING JOB POSTS');
    } finally {
      dispatch(setLoading(false));
    }
  };

  // load more on scroll
  const loadMore = () => {
    if (!isLastPage) {
      getJobsPosts();
    }
  };

  // function to apply filters to jobs
  const onPressApplyFilters = (
    values: string[],
    dateRange?: {
      startDate: Date;
      endDate: Date;
    },
  ) => {
    setSelectedFilters(values);
    values.forEach(value => {
      if (value === STRINGS.event) {
        setJobType('event');
      } else if (value === STRINGS.static) {
        setJobType('static');
      } else if (value === STRINGS.today) {
        setFilterDate({
          startDate: dateFormatterRev(new Date()),
          endDate: dateFormatterRev(new Date()),
        });
      } else if (value === STRINGS.tomorrow) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        setFilterDate({
          startDate: dateFormatterRev(tomorrow),
          endDate: dateFormatterRev(tomorrow),
        });
      } else if (value === STRINGS.this_Week) {
        const today = new Date();
        const endOfWeek = new Date(today);
        const daysUntilEndOfWeek = 6 - today.getDay();
        endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
        setFilterDate({
          startDate: dateFormatterRev(today),
          endDate: dateFormatterRev(endOfWeek),
        });
      } else if (value === STRINGS.this_month) {
        const today = new Date();
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        );
        setFilterDate({
          startDate: dateFormatterRev(today),
          endDate: dateFormatterRev(endOfMonth),
        });
      } else if (value === STRINGS.customDate) {
        if (dateRange) {
          setFilterDate({
            startDate: dateFormatterRev(dateRange.startDate),
            endDate: dateFormatterRev(dateRange.endDate),
          });
        }
      }
    });
  };

  //render item job post
  const renderItemListing = useCallback(
    ({item}: {item: IJobTypes}) => (
      <View style={styles.list}>
        <JobPostCard onPress={() => onPressViewDetails(item)} {...item} />
      </View>
    ),
    [isLoading, jobs],
  );

  // item rendering while loading
  const renderItemLoading = () => (
    <View style={styles.list}>
      <JobPostCardLoading />
    </View>
  );

  //refresh handler
  const onRefreshHandler = () => {
    setIsRefreshing(true);
    getJobsPosts(true);
  };

  //to open filter sheet
  const onPressFilterSheet = () => {
    homeFilterSheetRef.current?.snapToIndex(1);
  };

  // to show header animation
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
  };

  // handles cross press on button
  const onPressCrossFilter = (e: string) => {
    if (e === STRINGS.event || e === STRINGS.static) {
      setJobType(null);
    } else {
      setFilterDate({startDate: null, endDate: null});
    }
    setSelectedFilters(prev => {
      const prevFilters = [...prev];
      let updatedFilters = prevFilters.filter(filter => filter !== e);
      return updatedFilters;
    });
  };

  const onPressClearHomeFilter = () => {
    setJobType(null);
    setFilterDate({startDate: null, endDate: null});
    setSelectedFilters([]);
  };

  return (
    <View style={styles.container}>
      <HomeTopView
        onPressFilters={onPressFilterSheet}
        height={scrollY}
        isFilterApplied={selectedFilters.length > 0}
        onPress={displayModal}
      />
      <Row style={styles.filterView}>
        {selectedFilters &&
          selectedFilters.map((filter, index) => (
            <EmployeeHomeChip
              key={index}
              title={filter}
              onPressCross={onPressCrossFilter}
            />
          ))}
      </Row>
      <View style={styles.containerList}>
        <CustomList
          data={isLoading ? mockJobPostsLoading : jobs}
          onScroll={onScroll}
          renderItem={isLoading ? renderItemLoading : renderItemListing}
          ListHeaderComponent={
            <View
              style={[
                styles.headingView,
                selectedFilters.length === 0
                  ? {marginTop: verticalScale(24)}
                  : {marginTop: 0},
              ]}>
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
        selectionType="multiSelect"
        filters={provincesAndCities}
        snapPoints={[0.01, verticalScale(698)]}
        getAppliedFilters={() => console.log('Applied filters')}
      />
      <FilterListBottomSheet
        ref={homeFilterSheetRef}
        onPressClear={onPressClearHomeFilter}
        filters={HomeFilters}
        selectionType="singleSelect"
        initialSelectedOptions={selectedFilters}
        snapPoints={[0.01, verticalScale(430)]}
        getAppliedFilters={onPressApplyFilters}
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
    filterView: {
      marginHorizontal: verticalScale(24),
      gap: verticalScale(8),
    },
  });
  return styles;
};
