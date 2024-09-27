import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

import {Theme, useThemeAwareObject} from '@theme/index';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {getEventStatus} from '@screens/employeeScreens/employeeJobs/types';
import {CLOCK, JOB_ID, LOCATION_TERNARY} from '@assets/exporter';

import {getJobStartAndEndTime} from '@utils/utils.common';
import {verticalScale} from '@utils/metrics';

import {IJobPostTypes} from '@api/features/client/types';
import {getEventCardStylesFromJobStatus} from './JobStatusChip';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';

type ScheduledEventCard = {
  jobDetails: IJobPostTypes;
};

const ScheduledEventCard: React.FC<ScheduledEventCard> = ({jobDetails}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const cardStyles = getEventCardStylesFromJobStatus(jobDetails.status, theme);
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
        <View>
          <Text style={styles.title}>{jobDetails.job_type}</Text>
          <CustomText
            color="disabled"
            value={'Posted by Yash'}
            size={textSizeEnum.small}
          />
        </View>
        <Row style={styles.main} alignCenter>
          <Text style={[styles.status, {color: cardStyles?.borderColor}]}>
            {getEventStatus(jobDetails.status)}
          </Text>
        </Row>
      </Row>
      <View style={styles.infoView}>
        <Row alignCenter style={styles.marginTop}>
          <JOB_ID width={verticalScale(20)} height={verticalScale(20)} />
          <Text style={[styles.description, {marginTop: verticalScale(2)}]}>
            {jobDetails.id}
          </Text>
        </Row>
        <Row alignCenter style={styles.marginTop}>
          <CLOCK width={verticalScale(20)} height={verticalScale(20)} />
          <Text style={styles.description}>
            {getJobStartAndEndTime(jobDetails.startShift, jobDetails.endShift)}
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

export default ScheduledEventCard;

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
      gap: verticalScale(10),
    },
    infoView: {
      marginTop: verticalScale(12),
      gap: verticalScale(8),
    },
  });
  return styles;
};
