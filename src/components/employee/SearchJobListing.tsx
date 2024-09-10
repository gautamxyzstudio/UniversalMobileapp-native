import React, {useCallback} from 'react';
import CustomList from '@components/molecules/customList';
import JobCard from './JobCard';
import {verticalScale} from '@utils/metrics';
import {IJobTypes} from '@api/types';

type ISearchJobListingPropsTYpes = {
  data: IJobTypes[];
};

const SearchJobListing: React.FC<ISearchJobListingPropsTYpes> = ({data}) => {
  const renderItem = useCallback(({item}: {item: IJobTypes}) => {
    return <JobCard {...item} />;
  }, []);

  return (
    <CustomList
      isLastPage
      estimatedItemSize={verticalScale(177)}
      error={undefined}
      data={data}
      renderItem={renderItem}
    />
  );
};

export default SearchJobListing;

// const styles = StyleSheet.create({});
