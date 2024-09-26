/* eslint-disable react-hooks/exhaustive-deps */
import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {verticalScale, windowWidth} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import ProgressSteps from '@components/organisms/progressSteps';
import JobPostingStepOne from './JobPostingStepOne';
import JobPostingStepTwo from './JobPostingStepTwo';
import JobPostingStepThree from './JobPostingStepThree';
import CustomButton from '@components/molecules/customButton';
import {
  IJobPostInterface,
  IJobPostRef,
  IJobPostStepThreeRef,
  IJobPostStepTwoRef,
} from './types';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {fonts} from '@utils/common.styles';
import {useDispatch, useSelector} from 'react-redux';
import {
  jobDraftFromState,
  updateDraftReducer,
} from '@api/features/client/clientSlice';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {usePatchADraftMutation} from '@api/features/client/clientApi';
import {IJobPostStatus} from '@utils/enums';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {showToast} from '@components/organisms/customToast';
import {AppDispatch} from '@api/store';

export type IJobPostingPropType = {
  route: {
    params: {
      draftId: number | null;
    };
  };
};

const JobPosting: React.FC<IJobPostingPropType> = ({route}) => {
  const {insetsBottom, insetsTop} = useScreenInsets();
  const styles = useThemeAwareObject(getStyles);
  const toast = useToast();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(userBasicDetailsFromState);
  const [jobPostFields, updateJobPostFields] = useState<any>();
  const jobPostStepOneRef = useRef<IJobPostRef | null>(null);
  const jobPostStepTwoRef = useRef<IJobPostStepTwoRef | null>(null);
  const jobPostStepThreeRef = useRef<IJobPostStepThreeRef | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const navigation = useNavigation<NavigationProps>();
  const flatListRef = useRef<FlatList | null>(null);
  const draftsFromState = useSelector(jobDraftFromState);
  const {draftId} = route.params;
  const [updateDraft] = usePatchADraftMutation();

  useEffect(() => {
    if (draftId) {
      setDraftData();
    }
  }, [draftId]);

  //set data incase for edit draft
  const setDraftData = () => {
    let selectedDraftId = draftsFromState.findIndex(
      draft => draft.id === draftId,
    );

    if (selectedDraftId !== -1) {
      let selectedDraft = draftsFromState[selectedDraftId];
      if (
        jobPostStepOneRef.current?.setData &&
        jobPostStepTwoRef.current?.setData &&
        jobPostStepThreeRef.current?.setData
      ) {
        jobPostStepOneRef.current.setData({
          job_name: selectedDraft.job_name ?? '',
          job_type: selectedDraft.job_type ?? '',
          jobDuties: selectedDraft.jobDuties ?? '',
          description: selectedDraft.description ?? '',
        });
        jobPostStepTwoRef.current.setData({
          eventDate: selectedDraft.eventDate ?? new Date(),
          startShift: selectedDraft.startShift ?? new Date(),
          endShift: selectedDraft.endShift ?? new Date(),
          location: selectedDraft.location ?? '',
          city: selectedDraft.city ?? '',
          address: selectedDraft.address ?? '',
          postalCode: selectedDraft.postalCode ?? '',
        });
        jobPostStepThreeRef.current.setData({
          salary: selectedDraft.salary ?? '',
          required_certificates: selectedDraft.required_certificates ?? [],
          requiredEmployee: selectedDraft.requiredEmployee ?? 0,
          gender: selectedDraft.gender,
        });
      }
    }
  };

  //next press step handler
  const onPressNext = async () => {
    if (jobPostStepOneRef.current?.validate && currentIndex === 0) {
      const stepOneResult = await jobPostStepOneRef!.current!.validate();
      if (stepOneResult.isValid) {
        console.log(stepOneResult.fields, 'FIELDS');
        setCurrentIndex(currentIndex + 1);
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
        updateJobPostFields((prev: any) => {
          const prevData = {...prev};
          return {
            ...prevData,
            ...stepOneResult.fields,
            job_type: stepOneResult.fields?.job_type.toLowerCase(),
            job_duties: stepOneResult.fields?.jobDuties,
            description: stepOneResult.fields?.description,
          };
        });
      }
    }
    if (jobPostStepTwoRef.current?.validate && currentIndex === 1) {
      const stepTwoResult = await jobPostStepTwoRef!.current!.validate();
      if (stepTwoResult.isValid) {
        setCurrentIndex(currentIndex + 1);
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
        updateJobPostFields((prev: any) => {
          const prevData = {...prev};
          return {...prevData, ...stepTwoResult.fields};
        });
      }
    }
    if (jobPostStepThreeRef.current?.validate && currentIndex === 2) {
      const stepThreeResult = await jobPostStepThreeRef!.current!.validate();
      if (stepThreeResult.isValid) {
        updateJobPostFields((prev: any) => {
          const prevData = {...prev};
          return {...prevData, ...stepThreeResult.fields};
        });
      }
      let postDetails = {...jobPostFields, ...stepThreeResult.fields};
      if (draftId) {
        updateDraftHandler(postDetails);
      } else {
        navigation.navigate('reviewJobPost', {
          postDetails,
        });
      }
    }
  };

  // update draft
  const updateDraftHandler = withAsyncErrorHandlingPost(
    async (fields: IJobPostInterface) => {
      const response: any = await updateDraft({
        id: draftId ?? 0,
        body: {
          data: {
            ...fields,
            status: IJobPostStatus.OPEN,
            client_details: user?.details?.detailsId ?? 0,
          },
        },
      });
      if (response) {
        console.log(response, 'RESPONSE');
        showToast(toast, STRINGS.draft_updated_successful, 'success');
        dispatch(updateDraftReducer(response.data));
        navigation.navigate('jobPostDrafts');
      }
    },
    toast,
    dispatch,
  );

  const onPressPrev = () => {
    setCurrentIndex(currentIndex - 1);
    flatListRef.current?.scrollToIndex({
      index: currentIndex - 1,
      animated: true,
    });
  };
  return (
    <LinearGradient
      style={[styles.container, {paddingTop: insetsTop}]}
      locations={[0, 0.2, 1]}
      colors={['#182452', 'rgba(24, 36, 82, 0.80)', '#5F70AF']}>
      <View style={styles.headerContainer}>
        <HeaderWithBack
          renderRightIcon={true}
          headerTitle={draftId ? STRINGS.edit_draft : STRINGS.jobPosting}
        />
      </View>
      <ProgressSteps
        labels={['Details', 'General', 'Requirements']}
        activeStep={currentIndex}
      />
      <View style={[styles.mainView, {paddingBottom: insetsBottom}]}>
        <FlatList
          data={[1, 2, 3]}
          ref={flatListRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEnabled={false}
          bounces={false}
          renderItem={({index}) => {
            return (
              <View
                style={{
                  width: windowWidth,
                  paddingHorizontal: verticalScale(24),
                }}>
                {index === 0 && <JobPostingStepOne ref={jobPostStepOneRef} />}
                {index === 1 && <JobPostingStepTwo ref={jobPostStepTwoRef} />}
                {index === 2 && (
                  <JobPostingStepThree ref={jobPostStepThreeRef} />
                )}
              </View>
            );
          }}
        />
        <View style={styles.bottomView}>
          {currentIndex > 0 ? (
            <CustomButton
              disabled={false}
              buttonStyle={styles.secondaryButton}
              titleStyles={styles.buttonTitle}
              title="Previous"
              onButtonPress={onPressPrev}
            />
          ) : (
            <View />
          )}
          <CustomButton
            disabled={false}
            buttonStyle={styles.buttonPrimary}
            title={
              currentIndex === 2
                ? draftId
                  ? STRINGS.update
                  : STRINGS.submit
                : STRINGS.next
            }
            onButtonPress={onPressNext}
          />
        </View>
      </View>
    </LinearGradient>
  );
};

export default JobPosting;

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    headerContainer: {
      marginHorizontal: verticalScale(24),
      marginBottom: verticalScale(12),
    },
    mainView: {
      borderTopLeftRadius: 56,
      marginTop: verticalScale(24),
      paddingTop: verticalScale(24),
      flex: 1,
      backgroundColor: colors.color.backgroundWhite,
    },
    bottomView: {
      flexDirection: 'row',
      borderTopWidth: 1,
      borderTopColor: colors.color.grey,
      paddingHorizontal: verticalScale(24),
      justifyContent: 'space-between',
      paddingTop: verticalScale(16),
    },
    secondaryButton: {
      width: verticalScale(120),
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: colors.color.blueLight,
    },
    buttonTitle: {
      color: colors.color.blueLight,
      ...fonts.medium,
    },
    buttonPrimary: {
      width: verticalScale(120),
    },
  });
  return styles;
};
