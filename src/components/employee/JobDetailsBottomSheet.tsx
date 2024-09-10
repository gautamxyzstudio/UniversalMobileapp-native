import {Alert, Image, StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {verticalScale, windowHeight} from '@utils/metrics';

import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {
  BRIEF_CASE,
  CALENDER_THIRD,
  CLOCK_SEC,
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
import {
  jobDescriptionMock,
  jobRequirementsMock,
  requiredCertificatesMock,
} from '@api/mockData';
import {IJobTypes} from '@api/types';

type IJobDetailsBottomSheetProps = {
  jobDetails: IJobTypes | null;
};

const JobDetailsBottomSheet = React.forwardRef<
  BottomSheetModal,
  IJobDetailsBottomSheetProps
>(({jobDetails}, ref) => {
  const styles = useThemeAwareObject(createStyles);

  const modalHeight = verticalScale(windowHeight * 0.83);
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);
  const onClose = () => {
    // @ts-ignore
    ref.current?.snapToIndex(0);
  };

  return (
    <BaseBottomSheet ref={ref} snapPoints={snapPoints} onClose={onClose}>
      <View style={styles.container}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[4]}
          contentContainerStyle={styles.scrollView}>
          {/* <CustomImageComponent
            defaultSource={ICONS.imagePlaceholder}
            image={jobDetails.banner}
            resizeMode="cover"
            customStyle={styles.profilePicture}
          /> */}
          <Image
            style={styles.profilePicture}
            resizeMode="cover"
            source={ICONS.imagePlaceholder}
          />
          <Text style={styles.title}>{jobDetails?.title}</Text>
          <Text style={styles.jobName}>{jobDetails?.companyName}</Text>
          <Row style={styles.location} alignCenter>
            <LOCATION_TERNARY
              width={verticalScale(20)}
              height={verticalScale(20)}
            />
            <Text style={styles.locationText}>{jobDetails?.location}</Text>
          </Row>
          <View style={styles.headerView}>
            <Row wrap spaceBetween style={styles.stickyHeader}>
              <JobDetailsTopTag icon={BRIEF_CASE} title={STRINGS.night_Shift} />
              <JobDetailsTopTag icon={DOLLAR_SMALL} title={'20$ /hr'} />
            </Row>
            <Row wrap spaceBetween style={styles.stickyHeaderBottom}>
              <JobDetailsTopTag icon={CLOCK_SEC} title={'7 pm - 2 am'} />
              <JobDetailsTopTag icon={CALENDER_THIRD} title={'2 Jun - 3 Jun'} />
            </Row>
          </View>

          <View style={styles.descriptionView}>
            <JobDetailsRenderer
              heading={STRINGS.jobDescription}
              description={jobDescriptionMock}
            />
            <View style={styles.spacer} />
            <JobDetailsRenderer
              heading={STRINGS.jobDuties}
              description={jobRequirementsMock}
            />
            <View style={styles.spacer} />
            <JobDetailsRenderer
              heading={STRINGS.requiredCertificates}
              description={requiredCertificatesMock}
            />
            <View style={styles.spacer} />
            <Text style={styles.heading}>{STRINGS.address}</Text>
            <Text style={styles.pStyles}>{jobDetails?.location}</Text>
            {/* <JobDetailsRenderer
              heading={STRINGS.address}
              description={jobDetails.location}
            /> */}
          </View>
          <Spacers type="vertical" />
        </BottomSheetScrollView>
        <BottomButtonView
          disabled={false}
          title={STRINGS.applyNow}
          onButtonPress={() => Alert.alert('job applied')}
        />
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
      flex: 1,
      marginTop: verticalScale(16),
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
    spacer: {
      height: verticalScale(16),
    },
  });
  return styles;
};
