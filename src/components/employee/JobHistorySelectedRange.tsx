import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {jobRangeFormatter} from '@utils/utils.common';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';

type IJobHistorySelectedRange = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const JobHistorySelectedRange: React.FC<IJobHistorySelectedRange> = ({
  startDate,
  endDate,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const jobRange = `${startDate ? jobRangeFormatter(startDate) : ''} ${
    endDate ? ` - ${jobRangeFormatter(endDate)}` : ''
  }`;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{jobRange}</Text>
    </View>
  );
};

export default JobHistorySelectedRange;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      paddingVertical: verticalScale(12),
      backgroundColor: color.ternary,
      paddingHorizontal: verticalScale(24),
    },
    title: {
      ...fonts.medium,
      color: color.textPrimary,
    },
  });

  return styles;
};
