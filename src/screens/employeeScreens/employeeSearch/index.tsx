import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import SafeAreaView from '@components/safeArea';
import SearchInput from '@components/molecules/InputTypes/SearchInput';
import {useTheme} from '@theme/Theme.context';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import RecentSearches from '@components/molecules/recentSearch';

import SearchJobListing from '@components/employee/SearchJobListing';
import SearchJobTItleList from '@components/employee/SearchJobTItleList';
import {mockJobTitles, mockRecentSearches, mockJobs} from '@api/mockData';
import {useNavigation} from '@react-navigation/native';

const EmployeeSearch = () => {
  const {theme} = useTheme();
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const [jobTitles, setJobTitles] = useState<{id: number; title: string}[]>([]);
  const [searchState, updateSearchState] = useState<
    'idle' | 'searching' | 'fetched'
  >('idle');

  const onPressRecentSearch = (recentSearch: {id: number; title: string}) => {
    setSearch(recentSearch.title);
    updateSearchState('fetched');
  };

  const onPressCross = () => {
    setSearch('');
    updateSearchState('idle');
  };

  const onPressSuggestion = () => {
    updateSearchState('fetched');
  };

  const handleTextChange = (e: string) => {
    if (e.length > 0) {
      updateSearchState('searching');
      setSearch(e);
      const filteredData = mockJobTitles.filter(job =>
        job.title.toLowerCase().includes(e.trim().toLowerCase()),
      );
      setJobTitles(filteredData);
    } else {
      setSearch(e);
      updateSearchState('idle');
    }
  };
  return (
    <SafeAreaView
      backgroundColor={theme.color.backgroundWhite}
      paddingHorizontal>
      <SearchInput
        value={search}
        innerContainerStyle={styles.search}
        onChangeText={handleTextChange}
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
        {searchState === 'fetched' && <SearchJobListing data={mockJobs} />}
        {searchState === 'searching' && (
          <SearchJobTItleList
            data={jobTitles}
            search={search}
            onPressSuggestion={onPressSuggestion}
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
