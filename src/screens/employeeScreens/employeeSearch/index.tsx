/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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
import {IC_EMPTY_JOBS_LIST, IC_SEARCH_EMPTY} from '@assets/exporter';
import {useDispatch, useSelector} from 'react-redux';
import {
  addNewSearchEmployee,
  deleteRecentSearch,
  getRecentSearchesFromStateEmployee,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {useJobDetailsContext} from 'src/contexts/displayJobDetailsContext';
import {IJobPostStatus} from '@utils/enums';

const EmployeeSearch = () => {
  const {theme} = useTheme();
  const [search, setSearch] = useState('');
  const user = useSelector(userBasicDetailsFromState);
  const [searchJobsHandler, {error}] = useLazyGetJobPostsViaSearchQuery();
  const {onPressSheet, appliedJobDetails} = useJobDetailsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const recentSearches = useSelector(getRecentSearchesFromStateEmployee);
  const [isLastPage, setIsLastPage] = useState(true);
  const [jobs, setJobs] = useState<IJobPostTypes[]>([]);
  const navigation = useNavigation();

  const [searchState, updateSearchState] = useState<'idle' | 'searching'>(
    'idle',
  );

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
    }, 400),
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
  }, [search]);

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

  return (
    <SafeAreaView
      backgroundColor={theme.color.backgroundWhite}
      paddingHorizontal>
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
      <View style={styles.mainView}>
        {searchState === 'idle' && (
          <RecentSearches
            onPressCross={onPressCrossRecent}
            searches={recentSearches}
            onPressRecentSearch={onPressRecentSearch}
          />
        )}
        {searchState === 'searching' && (
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
            renderItem={renderItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default EmployeeSearch;

const styles = StyleSheet.create({
  searchContainer: {
    gap: verticalScale(8),
  },
  mainView: {
    flex: 1,
    marginTop: verticalScale(24),
  },
  search: {
    borderRadius: 40,
    height: verticalScale(44),
  },
});
