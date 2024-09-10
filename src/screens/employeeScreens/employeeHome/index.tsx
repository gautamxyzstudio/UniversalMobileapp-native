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
import HomeListHeaderView from '@components/employee/HomeListHeaderView';
import {verticalScale} from '@utils/metrics';
import JobCard, {IJobDetailsPropTypes} from '@components/employee/JobCard';

import {STRINGS} from 'src/locales/english';

import {useSharedValue} from 'react-native-reanimated';
import RecommendedJobs from '@components/employee/RecommendedJobs';
import CustomList from '@components/molecules/customList';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {useJobDetailsContext} from 'src/Providers/JobDetailsContextProvider';
import {useLazyGetUserQuery} from '@api/features/user/userApi';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateEmployeeDetails,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IEmployeeDetails} from '@api/features/user/types';

const EmployeeHome = () => {
  const styles = useThemeAwareObject(getStyles);
  const [data, setData] = useState<any[]>([]);
  const dispatch = useDispatch();
  const user = useSelector(userBasicDetailsFromState);
  const scrollY = useSharedValue(0);
  const {onPressSheet} = useJobDetailsContext();
  const [getUserDetails] = useLazyGetUserQuery();

  const bottomSheetRef = useRef<BottomSheetModal | null>(null);

  const displayJobDetails = (item: any) => {
    onPressSheet('show', item);
  };

  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (mockJobs.length > 0) {
      setData([appendMockJob, ...mockJobs]);
    }
  }, []);

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

  const renderItemListing = useCallback(
    ({item, index}: {item: IJobDetailsPropTypes; index: number}) => {
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
            <JobCard onPress={() => displayJobDetails(item)} {...item} />
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
        ListHeaderComponent={
          <>
            <HomeListHeaderView
              title={STRINGS.recommended_jobs}
              displayRightArrow={true}
            />
            <RecommendedJobs data={mockJobs} />
          </>
        }
        data={data}
        onScroll={onScroll}
        renderItem={renderItemListing as any}
        stickyHeaderIndices={[0]}
        getItemType={(item: any) => `${item.id}`}
        estimatedItemSize={verticalScale(177)}
        betweenItemSpace={verticalScale(12)}
        ListFooterComponent={<View />}
        ListFooterComponentStyle={styles.footer}
        error={undefined}
        isLastPage={false}
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
