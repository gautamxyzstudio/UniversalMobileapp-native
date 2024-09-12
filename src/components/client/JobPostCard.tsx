import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo} from 'react';
import {verticalScale, windowWidth} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {
  CALENDAR_SECONDARY,
  ICONS,
  JOB_ID,
  LOCATION_SMALL,
  MEAT_BALL,
} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {STRINGS} from 'src/locales/english';

import AnimatedPressable from '@components/atoms/AnimatedPressable';
import {useTheme} from '@theme/Theme.context';

import JobStatusChip from '@components/employee/JobStatusChip';
import {Circle, Svg} from 'react-native-svg';
import {dateFormatter, fromNowOn, timeFormatter} from '@utils/utils.common';
import {IJobPostTypes} from '@api/features/client/types';
import {IJobPostStatus} from '@utils/enums';
import {useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {isClientDetails} from '@utils/constants';

export interface IJobDetailsPropTypes extends IJobPostTypes {
  onPress?: () => void;
  cardWidth?: number;
  isDraft?: boolean;
}

const JobPostCard: React.FC<IJobDetailsPropTypes> = ({
  onPress,
  isDraft,
  cardWidth,
  ...cardProps
}) => {
  const styles = useThemeAwareObject(createStyles);
  const theme = useTheme();
  const user = useSelector(userBasicDetailsFromState);

  const {
    job_name,
    publishedAt,
    job_type,
    clientDetails,
    eventDate,
    status,
    startShift,
    endShift,
    location,
  } = cardProps;

  console.log(cardProps);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      {/* <CustomImageComponent
            defaultSource={ICONS.imagePlaceholder}
            image={banner}
            resizeMode="cover"
            customStyle={styles.image}
          /> */}
      <Row alignCenter style={styles.topView}>
        <Image
          resizeMode="cover"
          style={styles.image}
          source={ICONS.imagePlaceholder}
        />
        <View style={styles.jobDetails}>
          <Row spaceBetween>
            <View>
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[styles.title]}>
                {job_name}
              </Text>
              {user?.user_type === 'client' &&
              user.details &&
              isClientDetails(user.details) ? (
                <>
                  {isDraft ? (
                    <Text style={styles.postedDate}>8 may</Text>
                  ) : (
                    <>
                      {status === IJobPostStatus.CLOSED && (
                        <Text style={styles.notAccepting}>
                          {STRINGS.not_accepting}
                        </Text>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Text style={styles.postedDate}>
                  {clientDetails?.companyname}
                </Text>
              )}
            </View>
            <Row alignCenter style={styles.statusRow}>
              <JobStatusChip
                backgroundColor={theme.theme.color.lightGrey}
                color={theme.theme.color.textPrimary}
                status={job_type}
              />
            </Row>
          </Row>
        </View>
      </Row>
      <View style={styles.midContainer}>
        {!isDraft && (
          <Row alignCenter>
            <JOB_ID width={verticalScale(20)} height={verticalScale(20)} />
            <Text style={styles.locationText}>S2</Text>
          </Row>
        )}

        <Row>
          <Row alignCenter>
            <CALENDAR_SECONDARY
              width={verticalScale(20)}
              height={verticalScale(20)}
            />
            <Text style={styles.locationText}>{dateFormatter(eventDate)}</Text>
          </Row>
          <View style={styles.dividerVertical} />
          {startShift && endShift && (
            <Text
              style={[styles.locationText, {marginLeft: 0}]}>{`${timeFormatter(
              startShift,
            )} - ${timeFormatter(endShift)}`}</Text>
          )}
        </Row>
        <Row alignCenter>
          <LOCATION_SMALL
            width={verticalScale(20)}
            height={verticalScale(20)}
          />
          <Text style={styles.locationText}>{location}</Text>
        </Row>
      </View>
      {!isDraft && (
        <>
          <View style={styles.divider} />
          <Row spaceBetween alignCenter>
            {publishedAt && (
              <Text style={styles.postedDate}>{fromNowOn(publishedAt)}</Text>
            )}
            <TouchableOpacity>
              <Text style={styles.postedDate}>Posted by Yash</Text>
            </TouchableOpacity>
          </Row>
        </>
      )}
    </Pressable>
  );
};

export default memo(JobPostCard);
const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      padding: verticalScale(12),
      width: windowWidth - verticalScale(48),
      borderWidth: 1,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: '#fff',
      borderColor: 'rgba(18, 18, 18, 0.16)',
    },
    notAccepting: {
      color: color.red,
      ...fonts.regular,
    },

    midContainer: {
      marginTop: verticalScale(24),
      gap: verticalScale(8),
    },

    postedBy: {
      marginTop: verticalScale(2),
    },
    image: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: verticalScale(20),
    },
    statusRow: {},

    dividerVertical: {
      width: verticalScale(1),
      marginHorizontal: verticalScale(8),
      height: '100%',
      backgroundColor: color.grey,
    },

    jobDetails: {
      flex: 1,
      marginLeft: verticalScale(12),
    },

    title: {
      color: color.textPrimary,
      ...fonts.mediumBold,
    },
    companyName: {
      color: color.disabled,
      marginTop: 2,
      maxWidth: verticalScale(200),
    },
    topView: {
      width: '100%',
    },

    locationText: {
      ...fonts.regular,
      marginLeft: verticalScale(4),
      color: color.textPrimary,
      ...Platform.select({
        ios: {
          lineHeight: verticalScale(18),
        },
      }),
    },

    divider: {
      backgroundColor: color.strokeLight,
      height: verticalScale(1),
      width: '100%',
      marginVertical: verticalScale(12),
    },
    postedDate: {
      ...fonts.regular,
      color: color.disabled,
    },
  });

  return styles;
};
