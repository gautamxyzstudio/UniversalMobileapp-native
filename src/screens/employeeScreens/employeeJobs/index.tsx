import {StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import Filters, {IFilter} from '@components/molecules/Fiilters';

import {getJobStatus} from './types';
import CustomList from '@components/molecules/customList';
import JobCard, {IJobDetailsPropTypes} from '@components/employee/JobCard';
import {verticalScale} from '@utils/metrics';
import {mockJobFilters, userMockJobs} from '@api/mockData';

const EmployeeJobs = () => {
  const [selectedFilterId, setSelectedFilterId] = useState(0);

  const [filters, setFilters] = useState<IFilter[]>([
    {id: 0, value: STRINGS.all},
  ]);

  useEffect(() => {
    if (filters.length < 2) {
      const newFilters = mockJobFilters.map(item => ({
        id: item.id,
        value: getJobStatus(item.status),
      }));

      setFilters(prevFilters => [...prevFilters, ...newFilters]);
    }
  }, [filters.length]);

  const renderItemListing = useCallback(
    ({item}: {item: IJobDetailsPropTypes}) => {
      return <JobCard {...item} />;
    },
    [],
  );
  return (
    <OnBoardingBackground
      childrenStyles={styles.container}
      hideBack
      title={STRINGS.jobs}>
      <Filters
        filters={filters}
        onFilterPress={filter => setSelectedFilterId(filter.id)}
        selectedFilterId={selectedFilterId}
      />
      <View style={styles.customList}>
        {/* <CustomList
          data={userMockJobs}
          renderItem={renderItemListing}
          getItemType={item => `${item.id}`}
          betweenItemSpace={12}
          estimatedItemSize={verticalScale(177)}
          error={undefined}
          isLastPage={false}
        /> */}
      </View>
    </OnBoardingBackground>
  );
};

export default EmployeeJobs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },

  customList: {
    flex: 1,
    marginTop: verticalScale(24),
    paddingLeft: verticalScale(24),
    justifyContent: 'center',
  },
});
