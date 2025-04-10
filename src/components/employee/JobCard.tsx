import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {verticalScale, windowWidth} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {
  ARROW_SECONDARY,
  CALENDAR_SECONDARY,
  DOLLAR,
  ICONS,
  LOCATION_SMALL,
  LOCATION_TERNARY,
} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {STRINGS} from 'src/locales/english';

import {dateFormatter, fromNowOn, timeFormatter} from '@utils/utils.common';
import AnimatedPressable from '@components/atoms/AnimatedPressable';
import {getStatusStylesFromStatus} from '@components/molecules/customList/types';
import {useTheme} from '@theme/Theme.context';
import {getJobStatus} from '@screens/employeeScreens/employeeJobs/types';
import JobStatusChip from './JobStatusChip';
import {IJobTypes} from '@api/types';

export interface IJobDetailsPropTypes extends IJobTypes {
  onPress?: () => void;
  cardWidth?: number;
}

const JobCard: React.FC<IJobDetailsPropTypes> = ({
  title,
  companyName,
  jobStartTime,
  jobEndTime,
  onPress,
  status,
  location,
  event,
  postedTime,
  jobDate,
}) => {
  const styles = useThemeAwareObject(createStyles);

  const theme = useTheme();
  const statusStyles = getStatusStylesFromStatus(status, theme.theme);

  return (
    <AnimatedPressable onPress={onPress} styles={[styles.container]}>
      <View style={styles.topView}>
        <Row alignCenter>
          {/* <CustomImageComponent
            defaultSource={ICONS.imagePlaceholder}
            image={banner}
            resizeMode="cover"
            customStyle={styles.image}
          /> */}
          <Image
            resizeMode="cover"
            style={styles.image}
            source={ICONS.imagePlaceholder}
          />
          <View style={styles.jobDetails}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={[
                styles.title,
                status !== 5 && {maxWidth: verticalScale(135)},
              ]}>
              {title}
            </Text>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.companyName}>
              {companyName}
            </Text>
          </View>
        </Row>
        <Row style={styles.statusRow}>
          <JobStatusChip
            backgroundColor={theme.theme.color.lightGrey}
            color={theme.theme.color.textPrimary}
            status={event}
          />
          {status !== 5 && (
            <JobStatusChip
              backgroundColor={
                statusStyles?.backgroundColor ??
                theme.theme.color.backgroundWhite
              }
              color={statusStyles?.color ?? theme.theme.color.backgroundWhite}
              status={getJobStatus(status)}
            />
          )}
        </Row>
      </View>
      <Row alignCenter style={styles.row}>
        <DOLLAR />
        <View style={styles.dateContainer}>
          <Text style={styles.locationText}>20$ /hr</Text>
        </View>
      </Row>
      <View style={styles.venueContainer}>
        <CALENDAR_SECONDARY
          width={verticalScale(20)}
          height={verticalScale(20)}
        />
        <Text style={styles.dateContainer}>
          {jobDate && (
            <Text style={styles.textDark}>{dateFormatter(jobDate)}</Text>
          )}
        </Text>
        <View style={styles.dividerVertical} />
        {jobStartTime && jobEndTime && (
          <Text style={styles.textDark}>{`${timeFormatter(
            jobStartTime,
          )} - ${timeFormatter(jobEndTime)}`}</Text>
        )}
      </View>
      <Row style={styles.locationContainer}>
        <LOCATION_SMALL width={verticalScale(20)} height={verticalScale(20)} />
        <Text style={styles.locationText}>{location}</Text>
      </Row>
      <View style={styles.divider} />
      <Row spaceBetween>
        {postedTime && (
          <Text style={styles.postedDate}>{fromNowOn(postedTime)}</Text>
        )}
        <TouchableOpacity onPress={onPress}>
          <Row style={styles.viewCont}>
            <Text style={styles.viewText}>{STRINGS.viewDetails}</Text>
            <View style={styles.arrowView}>
              <ARROW_SECONDARY
                width={verticalScale(16)}
                height={verticalScale(16)}
              />
            </View>
          </Row>
        </TouchableOpacity>
      </Row>
    </AnimatedPressable>
  );
};

export default memo(JobCard);
const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    dateContainer: {
      marginLeft: verticalScale(4),
    },
    date: {
      ...fonts.regular,
      color: color.disabled,
    },
    viewCont: {
      gap: verticalScale(8),
    },
    arrowView: {
      width: verticalScale(16),
      height: verticalScale(16),
      backgroundColor: color.lightGrey,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: verticalScale(8),
    },
    image: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: verticalScale(20),
    },
    statusRow: {
      gap: verticalScale(4),
    },
    row: {
      marginTop: verticalScale(24),
    },
    dividerVertical: {
      width: verticalScale(1),
      marginHorizontal: verticalScale(8),
      height: verticalScale(20),
      backgroundColor: color.grey,
    },
    textDark: {
      ...fonts.regular,
      color: color.textPrimary,
    },
    container: {
      padding: verticalScale(12),
      width: windowWidth - verticalScale(48),
      borderWidth: 1,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderColor: 'rgba(18, 18, 18, 0.16)',
    },
    imageStyle: {
      width: verticalScale(40),
      height: verticalScale(40),
      backgroundColor: color.greyText,
      borderRadius: verticalScale(20),
      borderWidth: 1,
      borderColor: color.strokeLight,
    },
    jobDetails: {
      marginLeft: verticalScale(12),
    },
    viewText: {
      ...fonts.small,
      color: color.darkBlue,
    },
    title: {
      color: color.textPrimary,
      ...fonts.mediumBold,
    },
    companyName: {
      color: color.disabled,
      maxWidth: verticalScale(120),
    },
    topView: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    tagContainer: {
      backgroundColor: color.lightGrey,
      borderRadius: 20,
      paddingHorizontal: verticalScale(8),
      paddingVertical: verticalScale(4),
      height: verticalScale(24),
    },
    locationContainer: {
      flexDirection: 'row',
      marginTop: verticalScale(8),
      gap: verticalScale(4),
      alignItems: 'center',
    },
    tag: {
      color: color.textPrimary,
      ...fonts.smallBold,
    },
    locationText: {
      flex: 1,
      ...fonts.small,
      lineHeight: verticalScale(18),
      color: color.textPrimary,
    },
    venueContainer: {
      flexDirection: 'row',
      marginTop: verticalScale(10),
      alignItems: 'center',
    },
    divider: {
      backgroundColor: color.strokeLight,
      height: verticalScale(1),
      width: '100%',
      marginVertical: verticalScale(12),
    },
    postedDate: {
      ...fonts.small,
      color: color.disabled,
    },
  });

  return styles;
};
