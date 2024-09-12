/* eslint-disable react-hooks/exhaustive-deps */
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import HomeTopView from '@components/employee/HomeTopView';
import {verticalScale} from '@utils/metrics';
import JobCard, {IJobDetailsPropTypes} from '@components/employee/JobCard';
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
import {provincesAndCities} from '@api/mockData';
import {useLazyFetchJobsQuery} from '@api/features/employee/employeeApi';
import {jobsFromState, updateJobs} from '@api/features/employee/employeeSlice';
import HomeListHeaderView from '@components/employee/HomeListHeaderView';
import {STRINGS} from 'src/locales/english';
import JobPostCard from '@components/client/JobPostCard';
import {IJobTypes} from '@api/features/employee/types';

const EmployeeHome = () => {
  const styles = useThemeAwareObject(getStyles);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, updateIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const user = useSelector(userBasicDetailsFromState);
  const scrollY = useSharedValue(0);
  const [getUserDetails] = useLazyGetUserQuery();
  const [getJobs] = useLazyFetchJobsQuery();
  const jobsInState = useSelector(jobsFromState);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  console.log(jobsInState, 'STATEJOBS');

  useEffect(() => {
    getUser();
    getJobsPosts();
  }, []);

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

  const getJobsPosts = async (isFirstPage: boolean = false) => {
    try {
      let page = isFirstPage ? 1 : currentPage + 1;
      let perPageRecord = 10;
      const usersJobsResponse = await getJobs(page).unwrap();
      if (usersJobsResponse) {
        dispatch(updateJobs({currentPage: page, jobs: usersJobsResponse.data}));
        setCurrentPage(page);
        setIsLastPage(
          usersJobsResponse.data.length === 0 ||
            usersJobsResponse.data.length !== perPageRecord,
        );
      }
    } catch (err) {
      console.log(err, 'ERROR GETTING JOB POSTS');
    }
  };

  const loadMore = () => {
    if (!isLastPage) {
      getJobsPosts();
    }
  };

  const renderItemListing = useCallback(
    ({item, index}: {item: IJobTypes; index: number}) => {
      if (index === 0) {
        return (
          <View style={styles.headingView}>
            <HomeListHeaderView
              title={STRINGS.jobListing}
              displayRightArrow={false}
            />
          </View>
        );
      } else {
        return (
          <View style={styles.list}>
            <JobPostCard
              clientDetails={item.client_details}
              onPress={() => console.log('hello world')}
              {...item}
            />
          </View>
        );
      }
    },

    [],
  );

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    scrollY.value = e.nativeEvent.contentOffset.y;
  };

  return (
    <View style={styles.container}>
      <HomeTopView height={scrollY} onPress={displayModal} />
      <CustomList
        data={jobs}
        onScroll={onScroll}
        renderItem={renderItemListing as any}
        stickyHeaderIndices={[0]}
        getItemType={(item: any) => `${item.id}`}
        estimatedItemSize={verticalScale(177)}
        betweenItemSpace={verticalScale(12)}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={styles.footer}
        error={undefined}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        isLastPage={isLastPage}
      />
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
