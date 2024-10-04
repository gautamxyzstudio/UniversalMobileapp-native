/* eslint-disable react-hooks/exhaustive-deps */
import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {verticalScale, windowHeight, windowWidth} from '@utils/metrics';

import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {
  BRIEF_CASE,
  CALENDER_THIRD,
  DOLLAR_SMALL,
  ICONS,
  LOCATION_TERNARY,
} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {STRINGS} from 'src/locales/english';
import JobDetailsTopTag from './JobDetailsTopTag';
import JobDetailsRenderer from './JobDetailsRenderer';

import BottomButtonView from '@components/organisms/bottomButtonView';
import Spacers from '@components/atoms/Spacers';

import {IJobPostTypes} from '@api/features/client/types';
import {useSelector} from 'react-redux';
import {
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IClientDetails} from '@api/features/user/types';
import {IJobPostStatus, IUserTypeEnum} from '@utils/enums';
import {
  extractTimeFromDate,
  extractDayAndMonthFromDate,
  getJobAddress,
  isClientDetails,
} from '@utils/constants';
import JobDetailsKey from './JobDetailsKeys';
import {useTheme} from '@theme/Theme.context';
import {getStatusStylesFromStatus} from '@components/client/JobStatusChip';
import {ActivityIndicator} from 'react-native-paper';

type IJobDetailsBottomSheetProps = {
  jobDetails: IJobPostTypes | null;
  onPressApply?: () => void;
  isDraft?: boolean;
};

const JobDetailsBottomSheet = React.forwardRef<
  BottomSheetModal,
  IJobDetailsBottomSheetProps
>(({jobDetails, isDraft, onPressApply}, ref) => {
  const styles = useThemeAwareObject(createStyles);
  const [isLoading, setIsLoading] = useState(true);
  const {theme} = useTheme();
  const [details, setDetails] = useState<IJobPostTypes | null>(null);
  const companyDetails = useSelector(
    userAdvanceDetailsFromState,
  ) as IClientDetails;
  const modalHeight = verticalScale(windowHeight * 0.83);
  const user = useSelector(userBasicDetailsFromState);
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);
  const onClose = () => {
    setIsLoading(true);
    setDetails(null);
    // @ts-ignore
    ref.current?.snapToIndex(0);
  };

  useEffect(() => {
    if (jobDetails) {
      setIsLoading(true);
      const timer = setTimeout(() => {
        setDetails(jobDetails);
        setIsLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [jobDetails]);

  const clientJobStatusAttributes = getStatusStyleAttributesFromStatus(
    user?.user_type ?? 'emp',
    details?.status ?? IJobPostStatus.OPEN,
    theme,
  );

  const companyName = useMemo(() => {
    return user?.user_type === 'emp'
      ? details?.client_details?.companyname
      : companyDetails?.companyName;
  }, [user?.user_type, details?.client_details, companyDetails?.companyName]);

  const shiftTime = useMemo(() => {
    return `${extractTimeFromDate(
      details?.startShift ?? new Date(),
    )} - ${extractTimeFromDate(details?.endShift ?? new Date())}`;
  }, [details?.startShift, details?.endShift]);

  const jobsDate = useMemo(() => {
    return extractDayAndMonthFromDate(details?.eventDate ?? new Date());
  }, [details?.eventDate]);

  const statusAttributes = getStatusStylesFromStatus(
    jobDetails?.status ?? IJobPostStatus.OPEN,
    theme,
  );

  const renderBottomContent = useMemo(() => {
    if (
      user?.user_type === 'client' &&
      user.details &&
      isClientDetails(user.details) &&
      !isDraft
    ) {
      return (
        <View style={styles.mainView}>
          <Text
            style={[
              styles.statusText,
              {color: clientJobStatusAttributes?.color},
            ]}>
            {clientJobStatusAttributes?.title}
          </Text>
        </View>
      );
    }

    if (
      user?.user_type === 'emp' &&
      user.details &&
      !isClientDetails(user.details)
    ) {
      if (details?.status === IJobPostStatus.OPEN) {
        return (
          <BottomButtonView
            disabled={false}
            title={STRINGS.applyNow}
            onButtonPress={onPressApply}
          />
        );
      } else {
        return (
          <Text style={[styles.statusText, {color: statusAttributes?.color}]}>
            {statusAttributes?.title}
          </Text>
        );
      }
    }
  }, [
    user,
    isDraft,
    clientJobStatusAttributes,
    details,
    onPressApply,
    statusAttributes,
  ]);

  return (
    <BaseBottomSheet ref={ref} snapPoints={snapPoints} onClose={onClose}>
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.color.darkBlue} />
          </View>
        ) : (
          <>
            <BottomSheetScrollView
              showsVerticalScrollIndicator={false}
              stickyHeaderIndices={[4]}
              contentContainerStyle={styles.scrollView}>
              {/* <CustomImageComponent
      defaultSource={ICONS.imagePlaceholder}
      image={details.banner}
      resizeMode="cover"
      customStyle={styles.profilePicture}
    /> */}
              <Image
                style={styles.profilePicture}
                resizeMode="cover"
                source={ICONS.imagePlaceholder}
              />
              <Text style={styles.title}>{details?.job_name}</Text>
              <Text style={styles.jobName}>{companyName}</Text>
              <Row style={styles.location} alignCenter>
                <LOCATION_TERNARY
                  width={verticalScale(20)}
                  height={verticalScale(20)}
                />
                <Text style={styles.locationText}>{details?.location}</Text>
              </Row>
              <View style={styles.headerView}>
                <Row wrap spaceBetween style={styles.stickyHeader}>
                  {details?.job_type && (
                    <JobDetailsTopTag
                      icon={BRIEF_CASE}
                      title={details?.job_type}
                    />
                  )}
                  {details?.salary && (
                    <JobDetailsTopTag
                      icon={DOLLAR_SMALL}
                      title={`${details?.salary}/$ hr`}
                    />
                  )}
                </Row>
                <Row wrap spaceBetween style={styles.stickyHeaderBottom}>
                  <JobDetailsTopTag
                    iconSize={verticalScale(20)}
                    icon={CALENDER_THIRD}
                    isMultiple
                    titleSec={shiftTime}
                    title={jobsDate ?? ''}
                  />
                </Row>
              </View>
              <Spacers type="vertical" size={24} scalable />
              {details?.requiredEmployee && (
                <JobDetailsKey
                  heading={STRINGS.requiredCertificates}
                  value={details.requiredEmployee.toString()}
                />
              )}
              <Spacers type="vertical" size={16} scalable />
              {details?.gender && (
                <JobDetailsKey
                  heading={STRINGS.gender}
                  value={details.gender}
                />
              )}
              <Spacers type="vertical" size={16} scalable />
              <View style={styles.descriptionView}>
                {details?.description && (
                  <JobDetailsRenderer
                    heading={STRINGS.jobDescription}
                    description={details?.description}
                  />
                )}

                <Spacers type="vertical" size={16} scalable />
                {details?.jobDuties && (
                  <JobDetailsRenderer
                    heading={STRINGS.jobDuties}
                    description={details?.jobDuties}
                  />
                )}
                <Spacers type="vertical" size={16} scalable />
                {/* {jobDetails?.required_certificates && (
        <JobDetailsRenderer
          heading={STRINGS.requiredCertificates}
          description={convertArrayOfStringsToUlLi(
            jobDetails?.required_certificates ?? [],
          )}
        />
      )} */}
                <Spacers type="vertical" size={16} scalable />
                <Text style={styles.heading}>{STRINGS.address}</Text>
                <Text style={styles.pStyles}>
                  {getJobAddress({
                    address: details?.address ?? '',
                    city: details?.city ?? '',
                    postalCode: details?.postalCode ?? '',
                    location: details?.location ?? '',
                  })}
                </Text>
              </View>
              <Spacers type="vertical" />
            </BottomSheetScrollView>
            {renderBottomContent}
          </>
        )}
      </View>
    </BaseBottomSheet>
  );
});

export default JobDetailsBottomSheet;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    descriptionView: {
      width: '100%',
      alignItems: 'flex-start',
    },
    container: {
      flexGrow: 1,
      alignItems: 'center',
    },
    profilePicture: {
      width: verticalScale(56),
      height: verticalScale(56),
      borderRadius: verticalScale(28),
      backgroundColor: color.lightGrey,
    },
    heading: {
      ...fonts.mediumBold,
      letterSpacing: 0.16,
      color: color.textPrimary,
    },
    loadingContainer: {
      flexGrow: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: color.textPrimary,
      ...fonts.mediumBold,
      marginTop: verticalScale(8),
      letterSpacing: 0.16,
    },
    pStyles: {
      color: color.textPrimary,
      ...fonts.regular,
      marginVertical: 0,
      fontWeight: '300',
    },
    jobName: {
      marginTop: verticalScale(2),
      ...fonts.regular,
      letterSpacing: 0.4,
      color: color.disabled,
    },
    scrollView: {
      alignItems: 'center',
      flexGrow: 1,
    },
    locationText: {
      ...fonts.small,
      color: color.textPrimary,
      marginLeft: verticalScale(4),
      letterSpacing: 0.12,
    },
    location: {
      marginTop: verticalScale(8),
    },
    stickyHeader: {
      height: verticalScale(40),
      width: '100%',
      justifyContent: 'space-between',
    },
    stickyHeaderBottom: {
      height: verticalScale(40),
      marginTop: verticalScale(8),
      width: '100%',
      justifyContent: 'space-between',
    },

    headerView: {
      height: verticalScale(112),
      paddingVertical: verticalScale(12),
      marginBottom: verticalScale(12),
      backgroundColor: color.primary,
    },
    mainView: {
      width: windowWidth,
      paddingHorizontal: verticalScale(24),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      gap: verticalScale(16),
      paddingTop: verticalScale(16),
      borderTopWidth: 1,
      borderTopColor: color.grey,
    },
    statusText: {
      ...fonts.mediumBold,
      marginTop: verticalScale(16),
    },
  });
  return styles;
};

export const getStatusStyleAttributesFromStatus = (
  user_type: 'client' | 'emp',
  IJobStatus: IJobPostStatus,
  theme: Theme,
) => {
  if (user_type === IUserTypeEnum.CLIENT) {
    switch (IJobStatus) {
      case IJobPostStatus.OPEN:
        return {color: theme.color.green, title: STRINGS.open};
      case IJobPostStatus.CLOSED:
        return {color: theme.color.red, title: STRINGS.closed_position};
    }
  }
};
