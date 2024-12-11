/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, Text, View} from 'react-native';
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
  LOCATION_SECONDARY,
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
  convertArrayOfStringsToUlLi,
} from '@utils/constants';
import JobDetailsKey from './JobDetailsKeys';
import {useTheme} from '@theme/Theme.context';
import {getStatusStylesFromStatus} from '@components/client/JobStatusChip';
import CustomImageComponent from '@components/atoms/customImage';

type IJobDetailsBottomSheetProps = {
  jobDetails: IJobPostTypes | null;
  onPressApply?: () => void;
  isDraft?: boolean;
  onClose: () => void;
};

const JobDetailsBottomSheet = React.forwardRef<
  BottomSheetModal,
  IJobDetailsBottomSheetProps
>(({jobDetails, isDraft, onClose, onPressApply}, ref) => {
  const styles = useThemeAwareObject(createStyles);
  const [details, setDetails] = useState<IJobPostTypes | null>(null);
  const {theme} = useTheme();
  const companyDetails = useSelector(
    userAdvanceDetailsFromState,
  ) as IClientDetails;
  const modalHeight = verticalScale(windowHeight * 0.83);
  const user = useSelector(userBasicDetailsFromState);
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);

  const onPressClose = () => {
    setDetails(null);
    onClose();
  };

  useEffect(() => {
    if (jobDetails) {
      setTimeout(() => {
        setDetails(jobDetails);
      }, 150);
    }
  }, [jobDetails]);

  console.log(ref);
  const clientJobStatusAttributes = getStatusStyleAttributesFromStatus(
    user?.user_type ?? 'emp',
    jobDetails?.status ?? IJobPostStatus.OPEN,
    theme,
  );

  const companyName = useMemo(() => {
    return user?.user_type === 'emp'
      ? jobDetails?.company?.name
      : companyDetails?.companyName;
  }, [jobDetails?.company]);

  const shiftTime = useMemo(() => {
    return `${extractTimeFromDate(
      jobDetails?.startShift ?? new Date(),
    )} - ${extractTimeFromDate(jobDetails?.endShift ?? new Date())}`;
  }, [jobDetails?.startShift, jobDetails?.endShift]);

  const jobsDate = useMemo(() => {
    return extractDayAndMonthFromDate(jobDetails?.eventDate ?? new Date());
  }, [jobDetails?.eventDate]);

  const statusAttributes = getStatusStylesFromStatus(
    jobDetails?.status ?? IJobPostStatus.OPEN,
    theme,
  );

  const renderBottomContent = useMemo(() => {
    if (
      user?.user_type === 'client' &&
      user.details &&
      isClientDetails(user?.details) &&
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
      if (jobDetails?.status === IJobPostStatus.OPEN) {
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
    jobDetails,
    onPressApply,
    statusAttributes,
  ]);

  console.log(jobDetails, 'JOB DETAILS');

  return (
    <BaseBottomSheet ref={ref} snapPoints={snapPoints} onClose={onPressClose}>
      <View style={styles.container}>
        <>
          {details && jobDetails && (
            <>
              <BottomSheetScrollView
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[4]}
                contentContainerStyle={styles.scrollView}>
                <CustomImageComponent
                  defaultSource={ICONS.imagePlaceholder}
                  image={jobDetails?.company?.logo?.url ?? ''}
                  resizeMode="cover"
                  customStyle={styles.profilePicture}
                />

                <Text style={styles.title}>{jobDetails?.job_name}</Text>
                <Text style={styles.jobName}>{companyName}</Text>
                <Row style={styles.location} alignCenter>
                  <LOCATION_SECONDARY
                    width={verticalScale(20)}
                    height={verticalScale(20)}
                  />
                  <Text style={styles.locationText}>
                    {jobDetails?.location}
                  </Text>
                </Row>
                <View style={styles.headerView}>
                  <Row wrap spaceBetween style={styles.stickyHeader}>
                    {jobDetails?.job_type && (
                      <JobDetailsTopTag
                        icon={BRIEF_CASE}
                        title={jobDetails?.job_type}
                      />
                    )}
                    {jobDetails?.salary && (
                      <JobDetailsTopTag
                        icon={DOLLAR_SMALL}
                        title={`${jobDetails?.salary}/$ hr`}
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
                <Spacers type="vertical" size={12} scalable />
                {jobDetails?.requiredEmployee && (
                  <JobDetailsKey
                    heading={STRINGS.requiredCertificates}
                    value={jobDetails.requiredEmployee.toString()}
                  />
                )}
                <Spacers type="vertical" size={16} scalable />
                {jobDetails?.gender && (
                  <JobDetailsKey
                    heading={STRINGS.gender}
                    value={jobDetails.gender}
                  />
                )}
                <Spacers type="vertical" size={16} scalable />
                <View style={styles.descriptionView}>
                  {jobDetails?.description && (
                    <JobDetailsRenderer
                      heading={STRINGS.jobDescription}
                      description={jobDetails?.description}
                    />
                  )}

                  <Spacers type="vertical" size={16} scalable />
                  {jobDetails?.jobDuties && (
                    <JobDetailsRenderer
                      heading={STRINGS.jobDuties}
                      description={jobDetails?.jobDuties}
                    />
                  )}
                  <Spacers type="vertical" size={16} scalable />
                  {jobDetails?.required_certificates && (
                    <JobDetailsRenderer
                      heading={STRINGS.requiredCertificates}
                      description={convertArrayOfStringsToUlLi(
                        jobDetails?.required_certificates ?? [],
                      )}
                    />
                  )}
                  <Spacers type="vertical" size={16} scalable />
                  <Text style={styles.heading}>{STRINGS.address}</Text>
                  <Spacers type="vertical" size={8} scalable />
                  <Text style={styles.pStyles}>
                    {getJobAddress({
                      address: jobDetails?.address ?? '',
                      city: jobDetails?.city ?? '',
                      postalCode: jobDetails?.postalCode ?? '',
                      location: jobDetails?.location ?? '',
                    })}
                  </Text>
                </View>
                <Spacers type="vertical" />
              </BottomSheetScrollView>
              {renderBottomContent}
            </>
          )}
        </>
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
      paddingVertical: verticalScale(12),
      backgroundColor: color.primary,
      flex: 1,
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
