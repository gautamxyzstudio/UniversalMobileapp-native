import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Theme, useThemeAwareObject} from '@theme/index';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {getJobStatus} from '@screens/employeeScreens/employeeJobs/types';
import {CLOCK, LOCATION_TERNARY, MEAT_BALL} from '@assets/exporter';

import {getJobStartAndEndTime} from '@utils/utils.common';
import {verticalScale} from '@utils/metrics';
import {getStatusAttributesFromStatus} from '@components/doucment/PreUploadedDocCardWithView';
import {IJobPostStatus} from '@utils/enums';
import {getStatusStylesFromStatus} from '@components/client/JobStatusChip';

type IScheduledJobCardProps = {
  jobDetails: IJobPostStatus;
};

const ScheduledJobCard: React.FC<IScheduledJobCardProps> = ({jobDetails}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const cardStyles = getStatusStylesFromStatus(jobDetails, theme);
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: cardStyles?.backgroundColor,
          borderColor: cardStyles?.borderColor,
          shadowColor: theme.color.shadow,
        },
      ]}>
      <Row spaceBetween alignCenter>
        <Text style={styles.title}>{jobDetails.title}</Text>
        <Row style={styles.main} alignCenter>
          <Text style={[styles.status, {color: cardStyles?.color}]}>
            {getJobStatus(jobDetails.status)}
          </Text>
          <MEAT_BALL width={verticalScale(20)} height={verticalScale(20)} />
        </Row>
      </Row>
      <View>
        <Row alignCenter style={styles.marginTop}>
          <CLOCK width={verticalScale(20)} height={verticalScale(20)} />
          <Text style={styles.description}>
            {getJobStartAndEndTime(
              jobDetails.jobStartTime,
              jobDetails.jobEndTime,
            )}
          </Text>
        </Row>
        <Row alignCenter style={styles.marginTop}>
          <LOCATION_TERNARY
            width={verticalScale(20)}
            height={verticalScale(20)}
          />
          <Text style={styles.description}>{jobDetails.location}</Text>
        </Row>
      </View>
    </View>
  );
};

export default ScheduledJobCard;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 4,
      padding: verticalScale(12),
      borderLeftWidth: 4,
      shadowOffset: {width: 0, height: 0.4},
      elevation: 10,
      shadowRadius: 2,
      shadowOpacity: 0.5,
    },
    title: {
      color: color.textPrimary,
      ...fonts.mediumBold,
    },
    marginTop: {
      marginTop: verticalScale(16),
      gap: verticalScale(4),
    },
    description: {
      color: color.textPrimary,
      ...fonts.regular,
    },
    status: {
      ...fonts.smallBold,
    },
    main: {
      gap: 10,
    },
  });
  return styles;
};
