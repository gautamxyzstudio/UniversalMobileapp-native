import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import JobCard from './JobCard';
import {verticalScale, windowWidth} from '@utils/metrics';
import {IJobTypes} from '@api/types';
import {useJobDetailsContext} from 'src/Providers/JobDetailsContextProvider';

type IRecommendedJobsProps = {
  data: IJobTypes[];
};

const RecommendedJobs: React.FC<IRecommendedJobsProps> = ({data}) => {
  const {onPressSheet} = useJobDetailsContext();

  const displayJobDetails = (item: IJobTypes) => {
    onPressSheet('show', item);
  };
  return (
    <ScrollView
      decelerationRate={'fast'}
      pagingEnabled
      snapToInterval={windowWidth - verticalScale(34)}
      showsHorizontalScrollIndicator={false}
      horizontal>
      <View style={styles.spacer} />
      {data.map((job, index) => (
        <View key={index} style={index === 0 ? {} : styles.mleft}>
          <JobCard
            onPress={() => displayJobDetails(job)}
            key={job.id}
            {...job}
          />
        </View>
      ))}
      <View style={styles.spacer} />
    </ScrollView>
  );
};

export default RecommendedJobs;

const styles = StyleSheet.create({
  spacer: {
    width: verticalScale(24),
  },
  mleft: {
    marginLeft: verticalScale(10),
  },
});
