import {FlatList, StatusBar, View} from 'react-native';
import React, {useRef, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import ProgressSteps from '@components/organisms/progressSteps';
import CustomButton from '@components/molecules/customButton';
import {verticalScale, windowWidth} from '@utils/metrics';
import JobSeekerDetailsStepsThree from './jobSeekerDetailsSteps/jobSeekerDetailsStepsThree';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {
  jobSeekerRef,
  userBasicDetails,
} from './jobSeekerDetailsSteps/jobSeekerDetailsStepsOne/types';
import {jobSeekerSecRef} from './jobSeekerDetailsSteps/jobSeekerDetailsStepsTwo/types';
import JobSeekerDetailsStepsOne from './jobSeekerDetailsSteps/jobSeekerDetailsStepsOne';
import JobSeekerDetailsStepsTwo from './jobSeekerDetailsSteps/jobSeekerDetailsStepsTwo/indext';
import {
  IOtherDocSpecifications,
  jobSeekerThirdRef,
  userDocuments,
} from './jobSeekerDetailsSteps/jobSeekerDetailsStepsThree/types';
import SuccessPopup from '@components/molecules/SucessPopup';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {ANIMATIONS, LOGOUT_SECONDARY, LOGOUT_WHITE} from '@assets/exporter';
import {useDispatch, useSelector} from 'react-redux';
import store, {AppDispatch} from '@api/store';

import {useSubmitUserDetailsMutation} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {customModalRef} from '@components/molecules/customModal/types';
import ActionPopup from '@components/molecules/ActionPopup';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import {
  IDocumentStatus,
  IUserDetailsRequestParams,
} from '@api/features/user/types';
import {useToast} from 'react-native-toast-notifications';

const JobSeekerDetailsAndDocs = () => {
  const stepOneRef = useRef<jobSeekerRef>(null);
  const stepTwoRef = useRef<jobSeekerSecRef>(null);
  const stepThreeRef = useRef<jobSeekerThirdRef>(null);

  // @ts-ignore
  const [employeeDocuments, setEmployeeDocuments] =
    useState<IUserDetailsRequestParams>({} as IUserDetailsRequestParams);
  const [submitUserDetails] = useSubmitUserDetailsMutation();
  const [submitOtherDocs] = useSubmitUserDetailsMutation();
  const navigation = useNavigation<NavigationProps>();
  const [isSuccessPopupVisible] = useState(false);
  const styles = useThemeAwareObject(getStyles);
  const {insetsBottom, insetsTop} = useScreenInsets();
  const dispatch = useDispatch<AppDispatch>();
  const FlatListRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const user = useSelector(userBasicDetailsFromState);
  const popupRef = useRef<customModalRef>(null);
  const toast = useToast();

  const onPressNext = async () => {
    if (stepOneRef?.current?.validate && currentIndex === 0) {
      const stepOneResult = await stepOneRef!.current!.validate();
      if (stepOneResult?.isValid && stepOneResult.fields) {
        const basicDetails: userBasicDetails = {
          name: stepOneResult.fields.name,
          selfie: stepOneResult.fields.selfie,
          phone: stepOneResult.fields.phone,
          dob: stepOneResult.fields.dob,
          email: stepOneResult.fields.email,
          city: stepOneResult.fields.city,
          workStatus: stepOneResult.fields.workStatus,
          address: stepOneResult.fields.address,
          gender: stepOneResult.fields.gender,
        };
        setEmployeeDocuments(prev => ({...prev, ...basicDetails}));
      }
      setCurrentIndex(currentIndex + 1);
      FlatListRef.current?.scrollToIndex({
        animated: true,
        index: currentIndex + 1,
      });
    }

    if (stepTwoRef?.current?.validate && currentIndex === 1) {
      const stepTwoResult = await stepTwoRef!.current!.validate();
      if (stepTwoResult.isValid) {
        setEmployeeDocuments(prev => ({...prev, ...stepTwoResult.fields}));

        setCurrentIndex(currentIndex + 1);

        FlatListRef.current?.scrollToIndex({
          animated: true,
          index: currentIndex + 1,
        });
      }
    }
    if (stepThreeRef!.current!.validate && currentIndex === 2) {
      const stepThreeResult = await stepThreeRef!.current!.validate();
      if (stepThreeResult.isValid) {
        setEmployeeDocuments(prev => ({...prev, ...stepThreeResult.fields}));
        submitUserDetailsHandler(
          stepThreeResult.fields,
          stepThreeResult.otherDocs,
        );
      }
    }
  };

  const onPressPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      FlatListRef.current?.scrollToIndex({
        animated: true,
        index: currentIndex - 1,
      });
    }
  };

  const submitUserDetailsHandler = async (
    thirdStep: userDocuments,
    otherDocument: IOtherDocSpecifications,
  ) => {
    console.log(otherDocument);

    const fields: IUserDetailsRequestParams = {
      name: employeeDocuments?.name,
      city: employeeDocuments?.city,
      email: employeeDocuments?.email,
      phone: employeeDocuments?.phone,
      dob: employeeDocuments?.dob ?? new Date(),
      selfie: employeeDocuments?.selfie ?? [],
      address: employeeDocuments?.address,
      securityDocumentBasic: thirdStep?.securityDocumentBasic,
      securityDocumentAdv: thirdStep?.securityDocumentAdv,
      govtidStaus: IDocumentStatus.PENDING,
      gender: employeeDocuments?.gender,
      resume: thirdStep?.resume,
      govtid: thirdStep?.govtid,
      sinNo: employeeDocuments?.sinNo,
      directDepositVoidCheque: employeeDocuments?.directDepositVoidCheque ?? -1,
      workStatus: employeeDocuments?.workStatus,
      supportingDocument: thirdStep?.supportingDocument ?? -1,
      Emp_id: user?.id ?? 0,
      bankAcNo: employeeDocuments?.bankAcNo,
      institutionNumber: employeeDocuments?.institutionNumber,
      trasitNumber: employeeDocuments?.trasitNumber,
      sinDocument: employeeDocuments?.sinDocument ?? -1,
      securityDocBasicStatus: IDocumentStatus.PENDING,
      securityDocumentAdvStatus: IDocumentStatus.PENDING,
      directDepositVoidChequeStatus: IDocumentStatus.PENDING,
      sinDocumentStatus: IDocumentStatus.PENDING,
      job_applications: [],
    };
    try {
      dispatch(setLoading(true));
      const submitUserDetailsResponse = await Promise.all([
        submitUserDetails({
          data: fields,
        }).unwrap(),
      ]);
      if (submitUserDetailsResponse) {
        dispatch(setLoading(false));
        navigation.reset({
          index: 0,
          routes: [{name: 'employeeTabBar'}],
        });
      }
    } catch (error) {
      dispatch(setLoading(false));
      toast.show('something went wrong', {
        type: 'error',
      });
      console.log(error);
    }
  };

  const onPressLogoutButton = () => {
    popupRef.current?.handleModalState(true);
  };

  const onPressLogout = () => {
    popupRef.current?.handleModalState(false);
    setTimeout(() => {
      store.dispatch({type: 'RESET'});
      navigation.reset({
        index: 0,
        routes: [{name: 'onBoarding'}],
      });
    }, 400);
  };
  return (
    <LinearGradient
      style={[styles.container, {paddingTop: insetsTop}]}
      locations={[0, 0.2, 1]}
      colors={['#182452', 'rgba(24, 36, 82, 0.80)', '#5F70AF']}>
      <View style={styles.headerContainer}>
        <HeaderWithBack
          withArrow={false}
          onPressRightIcon={onPressLogoutButton}
          renderRightIcon={true}
          icon={LOGOUT_WHITE}
          headerTitle={STRINGS.details}
        />
      </View>
      <ProgressSteps
        labels={['General', 'Details', 'Documents']}
        activeStep={currentIndex}
      />
      <View style={[styles.mainView, {paddingBottom: insetsBottom}]}>
        <FlatList
          data={[1, 2, 3]}
          ref={FlatListRef}
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
                {index === 0 && <JobSeekerDetailsStepsOne ref={stepOneRef} />}
                {index === 1 && <JobSeekerDetailsStepsTwo ref={stepTwoRef} />}
                {index === 2 && (
                  <JobSeekerDetailsStepsThree ref={stepThreeRef} />
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
            title={currentIndex === 2 ? STRINGS.submit : STRINGS.next}
            onButtonPress={onPressNext}
          />
        </View>
        <SuccessPopup
          isVisible={isSuccessPopupVisible}
          description={STRINGS.success_Description}
          title={STRINGS.signUpSuccessFully}
          icon={ANIMATIONS.animatedTick}
        />
        <ActionPopup
          ref={popupRef}
          title={STRINGS.are_you_sure_you_want_to_logout_this_account}
          buttonTitle={STRINGS.logOut}
          icon={LOGOUT_SECONDARY}
          buttonPressHandler={onPressLogout}
          type={'error'}
        />
      </View>
    </LinearGradient>
  );
};

export default JobSeekerDetailsAndDocs;
