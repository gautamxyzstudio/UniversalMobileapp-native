/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useTheme} from '@theme/Theme.context';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import RecentSearches from '@components/molecules/recentSearch';
import {mockRecentSearches} from '@api/mockData';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import {IJobPostTypes} from '@api/features/client/types';
import {useLazyGetJobPostsViaSearchQuery} from '@api/features/employee/employeeApi';
import CustomList from '@components/molecules/customList';
import JobPostCard from '@components/client/JobPostCard';
import {IC_EMPTY_JOBS_LIST, IC_SEARCH_EMPTY} from '@assets/exporter';

const EmployeeSearch = () => {
  const {theme} = useTheme();
  const [search, setSearch] = useState('');
  const [searchJobsHandler, {error}] = useLazyGetJobPostsViaSearchQuery();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLastPage, setIsLastPage] = useState(true);
  const [jobs, setJobs] = useState<IJobPostTypes[]>([]);
  const navigation = useNavigation();

  const [searchState, updateSearchState] = useState<'idle' | 'searching'>(
    'idle',
  );

  const onPressRecentSearch = (recentSearch: {id: number; title: string}) => {
    setSearch(recentSearch.title);
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
      setJobs(prevJobs =>
        isFirstPage ? res.data : [...prevJobs, ...res.data],
      );
      setCurrentPage(page);
      setIsLastPage(res.data.length === 0 || res.data.length !== perPage);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

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

  const renderItem = useCallback(({item}: {item: IJobPostTypes}) => {
    return <JobPostCard {...item} />;
  }, []);

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
      />
      <View style={styles.mainView}>
        {searchState === 'idle' && (
          <RecentSearches
            searches={mockRecentSearches}
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
