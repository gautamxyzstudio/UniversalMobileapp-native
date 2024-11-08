import {
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
  ARROW_SECONDARY,
  CALENDAR_SECONDARY,
  DOLLAR,
  ICONS,
  JOB_ID,
  LOCATION_SMALL,
} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {STRINGS} from 'src/locales/english';

import {useTheme} from '@theme/Theme.context';

import {
  dateFormatter,
  formatDateFromNow,
  salaryFormatter,
  timeFormatter,
} from '@utils/utils.common';
import {IJobPostTypes} from '@api/features/client/types';
import {IJobPostStatus} from '@utils/enums';
import {useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {
  extractDayAndMonthFromDate,
  getJobAddress,
  isClientDetails,
} from '@utils/constants';
import JobTypeChip from '@components/employee/JobStatusChip';
import JobStatusChip from './JobStatusChip';
import CustomImageComponent from '@components/atoms/customImage';

export interface IJobDetailsPropTypes extends IJobPostTypes {
  onPress?: () => void;
  isDraft?: boolean;
}

const JobPostCard: React.FC<IJobDetailsPropTypes> = ({
  onPress,
  isDraft,
  ...cardProps
}) => {
  const styles = useThemeAwareObject(createStyles);
  const theme = useTheme();
  const user = useSelector(userBasicDetailsFromState);

  const {
    job_name,
    publishedAt,
    location,
    job_type,
    logo,
    id,
    client_details,
    eventDate,
    notAccepting,
    status,
    startShift,

    endShift,
    city,
    salary,
  } = cardProps;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Row alignCenter style={styles.topView}>
        <CustomImageComponent
          defaultSource={ICONS.imagePlaceholder}
          image={logo?.url}
          resizeMode="cover"
          customStyle={styles.image}
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
                    <Text style={styles.postedDate}>
                      {extractDayAndMonthFromDate(publishedAt)}
                    </Text>
                  ) : (
                    <>
                      {notAccepting && status === IJobPostStatus.OPEN && (
                        <Text style={styles.notAccepting}>
                          {STRINGS.not_accepting}
                        </Text>
                      )}
                    </>
                  )}
                </>
              ) : (
                <Text style={styles.postedDate}>
                  {client_details?.companyname}
                </Text>
              )}
            </View>
            <Row alignCenter style={styles.statusRow}>
              <JobTypeChip
                backgroundColor={theme.theme.color.lightGrey}
                color={theme.theme.color.textPrimary}
                status={job_type}
              />
              {status !== IJobPostStatus.OPEN && (
                <JobStatusChip status={status} />
              )}
            </Row>
          </Row>
        </View>
      </Row>
      <View style={styles.midContainer}>
        {user?.user_type === 'client' &&
        user.details &&
        isClientDetails(user.details) ? (
          <>
            {!isDraft && (
              <Row alignCenter>
                <JOB_ID width={verticalScale(20)} height={verticalScale(20)} />
                <Text style={styles.locationText}>{id}</Text>
              </Row>
            )}
          </>
        ) : (
          <Row alignCenter>
            <DOLLAR width={verticalScale(20)} height={verticalScale(20)} />
            <Text style={styles.locationText}>{salaryFormatter(salary)}</Text>
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
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.locationText}>
            {getJobAddress({
              location: location,
              city: city,
            })}
          </Text>
        </Row>
      </View>
      {!isDraft && (
        <>
          <View style={styles.divider} />
          <Row spaceBetween alignCenter>
            {publishedAt && (
              <Text style={styles.postedDate}>
                {formatDateFromNow(publishedAt)}
              </Text>
            )}
            {user?.user_type === 'client' &&
            user.details &&
            isClientDetails(user.details) ? (
              <Text style={styles.postedDate}>
                {`Posted by ${client_details?.Name ?? ''}`}
              </Text>
            ) : (
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
            )}
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
    arrowView: {
      width: verticalScale(16),
      height: verticalScale(16),
      backgroundColor: color.lightGrey,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: verticalScale(8),
    },
    midContainer: {
      marginTop: verticalScale(24),
      gap: verticalScale(8),
    },
    viewCont: {
      gap: verticalScale(4),
    },
    viewText: {
      ...fonts.small,
      color: color.darkBlue,
    },

    postedBy: {
      marginTop: verticalScale(2),
    },
    image: {
      width: verticalScale(40),
      height: verticalScale(40),
      borderRadius: verticalScale(20),
    },
    statusRow: {
      gap: verticalScale(4),
      width: 'auto',
      justifyContent: 'flex-end',
    },

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
