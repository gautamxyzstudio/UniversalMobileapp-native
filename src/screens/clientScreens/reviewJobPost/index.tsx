import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {IJobPostInterface} from '../jobPosting/types';
import {STRINGS} from 'src/locales/english';
import UploadProfilePhoto from '@components/molecules/uploadProfilePhoto';
import {Row} from '@components/atoms/Row';
import {
  CALENDER_THIRD,
  DOLLAR_SMALL,
  EVENT,
  LOCATION_ICON,
} from '@assets/exporter';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import JobDetailsTopTag from '@components/employee/JobDetailsTopTag';
import JobDetailsRenderer from '@components/employee/JobDetailsRenderer';
import Spacers from '@components/atoms/Spacers';
import BottomButtonView from '@components/organisms/bottomButtonView';
import JobDetailsKey from '@components/employee/JobDetailsKeys';
import {useDispatch, useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {IJobPostStatus} from '@utils/enums';
import {
  convertArrayOfStringsToUlLi,
  extractDayAndMonthFromDate,
  extractTimeFromDate,
  getJobAddress,
  isClientDetails,
} from '@utils/constants';
import {
  usePostAJobMutation,
  useSaveAsDraftMutation,
} from '@api/features/client/clientApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {addNewJob} from '@api/features/client/clientSlice';

type IReviewJobPostProps = {
  route: {
    params: {
      postDetails: IJobPostInterface | null;
    };
  };
};

const ReviewJobPost: React.FC<IReviewJobPostProps> = ({route}) => {
  const dispatch = useDispatch();
  const jobDetails = route.params.postDetails;

  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();

  const user = useSelector(userBasicDetailsFromState);

  const wage = `${jobDetails?.salary}$ /hr`;
  const shiftTime = `${extractTimeFromDate(
    jobDetails?.startShift ?? new Date(),
  )} - ${extractTimeFromDate(jobDetails?.endShift ?? new Date())}`;

  const jobsDate = `${extractDayAndMonthFromDate(
    jobDetails?.eventDate ?? new Date(),
  )}`;

  const [postJob] = usePostAJobMutation();
  const [saveAsDraft] = useSaveAsDraftMutation();

  const styles = useThemeAwareObject(createStyles);

  console.log(jobDetails, 'jOBnoe');

  const postJobHandler = async () => {
    try {
      dispatch(setLoading(true));
      if (jobDetails) {
        const response = await postJob({
          data: {
            ...jobDetails,
            client_details: user?.details?.detailsId ?? 0,
            status: IJobPostStatus.OPEN,
          },
        }).unwrap();
        if (response) {
          dispatch(addNewJob(response));
          showToast(toast, 'job posted successfully', 'success');
          navigation.navigate('clientTabBar');
        }
      }
    } catch (error) {
      showToast(toast, STRINGS.someting_went_wrong, 'error');
    } finally {
      dispatch(setLoading(false));
    }
  };

  const saveAsDraftHandler = async () => {
    try {
      dispatch(setLoading(true));
      const response = await saveAsDraft({
        data: jobDetails,
        client_details: user?.details?.detailsId,
      }).unwrap();
      if (response) {
        showToast(toast, 'job post saved in drafts', 'success');
        navigation.navigate('clientTabBar');
      }
    } catch (error) {
      console.log(error);
      showToast(toast, STRINGS.someting_went_wrong, 'error');
    } finally {
      dispatch(setLoading(false));
    }
  };

  console.log(jobDetails);

  return (
    <OnBoardingBackground
      childrenStyles={styles.children}
      title={STRINGS.review}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Row alignCenter>
          <UploadProfilePhoto isEditable={false} />
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{jobDetails?.job_name}</Text>
            {user?.user_type === 'client' &&
              user.details &&
              isClientDetails(user.details) && (
                <Text style={styles.description}>
                  {user.details.companyName}
                </Text>
              )}

            <Row style={styles.row} alignCenter>
              <LOCATION_ICON />
              <Text style={styles.location}>{jobDetails?.location}</Text>
            </Row>
          </View>
        </Row>
        <View style={styles.tagView}>
          <Row wrap spaceBetween>
            <JobDetailsTopTag
              iconSize={verticalScale(20)}
              icon={EVENT}
              title={jobDetails?.job_type ?? 'static'}
            />
            <JobDetailsTopTag icon={DOLLAR_SMALL} title={wage} />
          </Row>
          <Row wrap spaceBetween>
            <JobDetailsTopTag
              iconSize={verticalScale(20)}
              icon={CALENDER_THIRD}
              isMultiple
              titleSec={shiftTime}
              title={jobsDate}
            />
          </Row>
        </View>
        <Spacers type="vertical" size={16} scalable />
        {jobDetails?.gender && (
          <JobDetailsKey heading={STRINGS.gender} value={jobDetails.gender} />
        )}
        <Spacers type="vertical" size={16} scalable />
        {jobDetails?.requiredEmployee && (
          <JobDetailsKey
            heading={STRINGS.requiredCertificates}
            value={jobDetails.requiredEmployee.toString()}
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
        </View>
        <Spacers type="vertical" size={16} scalable />
        <View style={styles.descriptionView}>
          {jobDetails?.jobDuties && (
            <JobDetailsRenderer
              heading={STRINGS.jobDuties}
              description={jobDetails?.jobDuties}
            />
          )}
        </View>
        <Spacers type="vertical" size={16} scalable />
        <View style={styles.descriptionView}>
          {jobDetails?.required_certificates && (
            <JobDetailsRenderer
              heading={STRINGS.requiredCertificates}
              description={convertArrayOfStringsToUlLi(
                jobDetails?.required_certificates ?? [],
              )}
            />
          )}
        </View>
        <Spacers type="vertical" size={16} scalable />
        <Text style={styles.heading}>{STRINGS.address}</Text>
        <Text style={styles.pStyles}>
          {getJobAddress({
            address: jobDetails?.address ?? '',
            city: jobDetails?.city ?? '',
            postalCode: jobDetails?.postalCode ?? '',
            location: jobDetails?.location ?? '',
          })}
        </Text>
        <Spacers type="vertical" size={16} scalable />
      </ScrollView>
      <BottomButtonView
        disabled={false}
        title={STRINGS.post}
        onPressSecondaryButton={saveAsDraftHandler}
        secondaryButtonTitles={STRINGS.draft}
        isMultiple
        onButtonPress={postJobHandler}
      />
    </OnBoardingBackground>
  );
};

export default ReviewJobPost;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    children: {
      flex: 1,
    },
    titleContainer: {
      gap: verticalScale(4),
      marginLeft: verticalScale(12),
    },
    title: {
      ...fonts.headingSmall,
      color: theme.color.textPrimary,
    },
    description: {
      ...fonts.medium,
      color: theme.color.disabled,
    },
    row: {
      rowGap: verticalScale(4),
    },
    location: {
      marginLeft: verticalScale(4),
      color: theme.color.textPrimary,
    },
    tagView: {
      gap: verticalScale(8),
      marginTop: verticalScale(24),
    },
    descriptionView: {
      width: '100%',
      alignItems: 'flex-start',
    },
    heading: {
      ...fonts.regularBold,
      letterSpacing: 0.16,
      color: theme.color.textPrimary,
    },
    pStyles: {
      color: theme.color.textPrimary,
      ...fonts.regular,
      marginVertical: 0,
      fontWeight: '300',
    },
  });
