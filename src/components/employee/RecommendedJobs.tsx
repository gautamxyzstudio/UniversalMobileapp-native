import {ScrollView, StyleSheet, View} from 'react-native';
import React from 'react';
import JobCard from './JobCard';
import {verticalScale, windowWidth} from '@utils/metrics';
import {IJobPostTypes} from '@api/features/client/types';

type IRecommendedJobsProps = {
  data: IJobPostTypes[];
};

const RecommendedJobs: React.FC<IRecommendedJobsProps> = ({data}) => {
  const displayJobDetails = () => {};
  return (
    <ScrollView
      decelerationRate={'fast'}
      pagingEnabled
      snapToInterval={windowWidth - verticalScale(34)}
      showsHorizontalScrollIndicator={false}
      horizontal></ScrollView>
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
