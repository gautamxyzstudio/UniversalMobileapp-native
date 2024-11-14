/* eslint-disable react-hooks/exhaustive-deps */
import {ScrollView, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useTheme} from '@theme/Theme.context';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import RecentSearches from '@components/molecules/recentSearch';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {IJobPostTypes} from '@api/features/client/types';
import {useLazyGetJobPostsViaSearchQuery} from '@api/features/employee/employeeApi';
import CustomList from '@components/molecules/customList';
import JobPostCard from '@components/client/JobPostCard';
import {
  FILTERS,
  IC_EMPTY_JOBS_LIST,
  IC_SEARCH_EMPTY,
  LOCATION_SECONDARY,
} from '@assets/exporter';
import {useDispatch, useSelector} from 'react-redux';
import {
  addNewSearchEmployee,
  addPreferredLocation,
  clearPreferredLocations,
  deleteRecentSearch,
  getFiltersDateFromState,
  getJobTypeFilterFromState,
  getPreferredLocationsFromState,
  getRecentSearchesFromStateEmployee,
  getSelectedFiltersFromState,
  removeFilter,
  removeLocation,
  setJobType,
  updateFilters,
  updateFiltersDate,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {useJobDetailsContext} from 'src/contexts/displayJobDetailsContext';
import {IJobPostStatus} from '@utils/enums';
import EmployeeFilterButton from '@components/employee/EmployeeFilterButton';
import Spacers from '@components/atoms/Spacers';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Row} from '@components/atoms/Row';
import EmployeeHomeChip from '@components/employee/EmployeeHomeChip';
import {provincesAndCities, HomeFilters} from '@api/mockData';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {dateFormatterRev} from '@utils/utils.common';

const EmployeeSearch = () => {
  const {theme} = useTheme();
  const [search, setSearch] = useState('');
  const user = useSelector(userBasicDetailsFromState);
  const [searchJobsHandler, {error}] = useLazyGetJobPostsViaSearchQuery();
  const {onPressSheet, appliedJobDetails} = useJobDetailsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const homeFilterSheetRef = useRef<BottomSheetModal | null>(null);
  const styles = useThemeAwareObject(createStyles);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const recentSearches = useSelector(getRecentSearchesFromStateEmployee);
  const [isLastPage, setIsLastPage] = useState(true);
  const [jobs, setJobs] = useState<IJobPostTypes[]>([]);
  const navigation = useNavigation();
  const [searchState, updateSearchState] = useState<'idle' | 'searching'>(
    'idle',
  );
  const selectedFilters = useSelector(getSelectedFiltersFromState);
  const preferredLocations = useSelector(getPreferredLocationsFromState);
  const jobType = useSelector(getJobTypeFilterFromState);
  const filterDate = useSelector(getFiltersDateFromState);

  const onPressRecentSearch = (recentSearch: string) => {
    setSearch(recentSearch);
  };

  const jobSearchQuery = async (
    character: string,
    isFirstPage: boolean = false,
  ) => {
    let perPage = 10;
    let page = isFirstPage ? 1 : currentPage + 1;
    try {
      const res = await searchJobsHandler({
        character: character,
        page: page,
        perPage: perPage,
        event: jobType,
        startDate: filterDate.startDate,
        endDate: filterDate.endDate,
        location: preferredLocations?.join(','),
      }).unwrap();
      setIsLoading(false);
      let jobsToShow: IJobPostTypes[] = res.data.filter(job => {
        const isApplied = job.job_applications?.some(
          applicant =>
            applicant.employee_details[0].id === user?.details?.detailsId,
        );
        return !isApplied;
      });

      setJobs(prevJobs =>
        isFirstPage ? jobsToShow : [...prevJobs, ...jobsToShow],
      );
      setCurrentPage(page);
      setIsLastPage(res.data.length === 0 || res.data.length !== perPage);
    } catch (cs) {
      setIsLoading(false);
      console.log(cs);
    }
  };

  useEffect(() => {
    if (appliedJobDetails) {
      let currentIndex = jobs.findIndex(job => job.id === appliedJobDetails.id);
      if (currentIndex !== -1) {
        setJobs(prev => {
          let prevJobs = [...prev];
          prevJobs[currentIndex] = {
            ...prevJobs[currentIndex],
            status: IJobPostStatus.APPLIED,
          };
          return prevJobs;
        });
      }
    }
  }, [appliedJobDetails]);

  const onPressCross = () => {
    setSearch('');
    updateSearchState('idle');
    setJobs([]);
  };

  const loadMore = () => {
    if (!isLastPage) {
      jobSearchQuery(search);
    }
  };

  const handleSearch = useCallback(
    _.debounce(query => {
      if (query) {
        jobSearchQuery(query, true);
      }
    }, 500),
    [],
  );

  useEffect(() => {
    if (search.length > 0) {
      updateSearchState('searching');
      setIsLoading(true);
      handleSearch(search);
    } else {
      updateSearchState('idle');
      setCurrentPage(1);
      setIsLastPage(true);
      setJobs([]);
    }
  }, [
    search,
    jobType,
    filterDate.startDate,
    filterDate.endDate,
    preferredLocations,
  ]);

  const onPressDone = () => {
    if (search) {
      let searchIndex = recentSearches.findIndex(
        value => value.toLocaleLowerCase() === search.toLocaleLowerCase(),
      );
      if (searchIndex === -1) {
        dispatch(addNewSearchEmployee(search));
      }
    }
  };

  const onPressCrossRecent = (recentSearchValue: string) => {
    dispatch(deleteRecentSearch(recentSearchValue));
  };

  const renderItem = useCallback(
    ({item}: {item: IJobPostTypes}) => {
      return (
        <JobPostCard
          {...item}
          onPress={() => onPressSheet('show', item, true)}
        />
      );
    },
    [jobs],
  );

  const onPressCrossLocation = (val: string) => {
    dispatch(removeLocation(val));
  };

  // handles cross press on button
  const onPressCrossFilter = (e: string) => {
    if (e === STRINGS.event || e === STRINGS.static) {
      dispatch(setJobType(null));
    } else {
      dispatch(updateFiltersDate({startDate: null, endDate: null}));
    }
    dispatch(removeFilter(e));
  };

  //location filter
  const locationFilterHandler = (loc: string[]) => {
    dispatch(addPreferredLocation(loc));
  };

  const clearLocationFilterHandler = () => {
    if (preferredLocations.length > 0) {
      dispatch(clearPreferredLocations());
    }
  };

  const onPressClearHomeFilter = () => {
    dispatch(setJobType(null));
    dispatch(updateFiltersDate({startDate: null, endDate: null}));
    dispatch(updateFilters([]));
  };

  // function to apply filters to jobs
  const onPressApplyFilters = (
    values: string[],
    dateRange?: {
      startDate: Date;
      endDate: Date;
    },
  ) => {
    dispatch(updateFilters(values));
    values.forEach(value => {
      if (value === STRINGS.event) {
        dispatch(setJobType('event'));
      } else if (value === STRINGS.static) {
        dispatch(setJobType('static'));
      } else if (value === STRINGS.today) {
        dispatch(
          updateFiltersDate({
            startDate: dateFormatterRev(new Date()),
            endDate: dateFormatterRev(new Date()),
          }),
        );
      } else if (value === STRINGS.tomorrow) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        dispatch(
          updateFiltersDate({
            startDate: dateFormatterRev(tomorrow),
            endDate: dateFormatterRev(tomorrow),
          }),
        );
      } else if (value === STRINGS.this_Week) {
        const today = new Date();
        const endOfWeek = new Date(today);
        const daysUntilEndOfWeek = 6 - today.getDay();
        endOfWeek.setDate(today.getDate() + daysUntilEndOfWeek);
        dispatch(
          updateFiltersDate({
            startDate: dateFormatterRev(today),
            endDate: dateFormatterRev(endOfWeek),
          }),
        );
      } else if (value === STRINGS.this_month) {
        const today = new Date();
        const endOfMonth = new Date(
          today.getFullYear(),
          today.getMonth() + 1,
          0,
        );
        dispatch(
          updateFiltersDate({
            startDate: dateFormatterRev(today),
            endDate: dateFormatterRev(endOfMonth),
          }),
        );
      } else if (value === STRINGS.customDate) {
        if (dateRange) {
          dispatch(
            updateFiltersDate({
              startDate: dateFormatterRev(dateRange.startDate),
              endDate: dateFormatterRev(dateRange.endDate),
            }),
          );
        }
      }
    });
  };

  return (
    <SafeAreaView backgroundColor={theme.color.primary}>
      <View style={styles.horizontalView}>
        <SearchInput
          value={search}
          showLoader={isLoading}
          innerContainerStyle={styles.search}
          onChangeText={e => setSearch(e)}
          onPressCross={onPressCross}
          placeHolder={STRINGS.search_by_job_title}
          navigation={navigation}
          onPressDone={onPressDone}
        />
      </View>
      <View style={styles.mainView}>
        {searchState === 'idle' && (
          <View style={styles.horizontalViewList}>
            <RecentSearches
              onPressCross={onPressCrossRecent}
              searches={recentSearches}
              onPressRecentSearch={onPressRecentSearch}
            />
          </View>
        )}
        {searchState === 'searching' && (
          <>
            <View style={styles.row}>
              <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                <Row alignCenter>
                  <Spacers type="horizontal" size={24} scalable />
                  <EmployeeFilterButton
                    icon={LOCATION_SECONDARY}
                    title={
                      'Location' +
                      (preferredLocations.length > 0
                        ? `(${preferredLocations.length})`
                        : '')
                    }
                    onPress={() => bottomSheetRef.current?.snapToIndex(1)}
                  />
                  <Spacers type="horizontal" size={8} scalable />
                  <EmployeeFilterButton
                    icon={FILTERS}
                    title={
                      'Filter' +
                      (selectedFilters.length > 0
                        ? `(${selectedFilters.length})`
                        : '')
                    }
                    onPress={() => homeFilterSheetRef.current?.snapToIndex(1)}
                  />
                  <Spacers type="horizontal" size={8} scalable />
                  <Row>
                    {selectedFilters &&
                      selectedFilters.map((filter, index) => (
                        <EmployeeHomeChip
                          key={index}
                          type="search"
                          customStyles={styles.chip}
                          title={filter}
                          onPressCross={onPressCrossFilter}
                          startDate={filterDate.startDate}
                          endDate={filterDate.endDate}
                        />
                      ))}
                  </Row>
                  <Row>
                    {preferredLocations &&
                      preferredLocations.map((filter, index) => (
                        <EmployeeHomeChip
                          key={index}
                          type="search"
                          customStyles={styles.chip}
                          title={filter}
                          onPressCross={onPressCrossLocation}
                          startDate={filterDate.startDate}
                          endDate={filterDate.endDate}
                        />
                      ))}
                  </Row>
                  <Spacers type="horizontal" size={24} scalable />
                </Row>
              </ScrollView>
            </View>
            <View style={styles.horizontalViewList}>
              <CustomList
                isLastPage={isLastPage}
                estimatedItemSize={verticalScale(177)}
                error={error}
                emptyListIllustration={
                  isLoading ? IC_EMPTY_JOBS_LIST : IC_SEARCH_EMPTY
                }
                emptyListSubTitle={
                  isLoading ? STRINGS.searching : STRINGS.no_jobs_found
                }
                onResponderEnd={loadMore}
                data={jobs}
                bottomSpace={100}
                renderItem={renderItem}
              />
            </View>
          </>
        )}
        <FilterListBottomSheet
          ref={bottomSheetRef}
          selectionType="multiSelect"
          onPressClear={clearLocationFilterHandler}
          filters={provincesAndCities}
          initialSelectedOptions={preferredLocations}
          snapPoints={[0.01, verticalScale(698)]}
          getAppliedFilters={value => locationFilterHandler(value)}
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
    </SafeAreaView>
  );
};

export default EmployeeSearch;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    searchContainer: {
      gap: verticalScale(8),
    },
    mainView: {
      flex: 1,
    },
    search: {
      borderRadius: 40,
      height: verticalScale(44),
    },
    row: {
      marginTop: verticalScale(16),
      marginBottom: verticalScale(8),
      height: verticalScale(44),
    },
    horizontalView: {
      marginHorizontal: verticalScale(24),
    },
    horizontalViewList: {
      flex: 1,
      backgroundColor: theme.color.backgroundWhite,
      paddingHorizontal: verticalScale(24),
      paddingTop: verticalScale(22),
    },
    chip: {
      marginRight: verticalScale(8),
    },
  });
  return styles;
};
