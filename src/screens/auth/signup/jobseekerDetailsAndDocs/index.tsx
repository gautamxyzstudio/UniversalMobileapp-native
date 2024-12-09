import {FlatList, View} from 'react-native';
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
import {
  IDocument,
  jobSeekerSecRef,
} from './jobSeekerDetailsSteps/jobSeekerDetailsStepsTwo/types';
import JobSeekerDetailsStepsOne from './jobSeekerDetailsSteps/jobSeekerDetailsStepsOne';
import JobSeekerDetailsStepsTwo from './jobSeekerDetailsSteps/jobSeekerDetailsStepsTwo/indext';
import {jobSeekerThirdRef} from './jobSeekerDetailsSteps/jobSeekerDetailsStepsThree/types';
import SuccessPopup from '@components/molecules/SucessPopup';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {ANIMATIONS, LOGOUT_SECONDARY, LOGOUT_WHITE} from '@assets/exporter';
import {useDispatch, useSelector} from 'react-redux';
import store, {AppDispatch} from '@api/store';

import {
  useLazyGetUserQuery,
  useSubmitOtherDocumentsMutation,
  useSubmitUserDetailsMutation,
} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {customModalRef} from '@components/molecules/customModal/types';
import ActionPopup from '@components/molecules/ActionPopup';
import {
  updateEmployeeDetails,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {
  IDocumentStatus,
  IEmployeeDetails,
  IUserDetailsRequestParams,
} from '@api/features/user/types';
import {useToast} from 'react-native-toast-notifications';
import {IOtherDocRequest} from './types';
import {showToast} from '@components/organisms/customToast';
import {ICustomErrorResponse} from '@api/types';

const JobSeekerDetailsAndDocs = () => {
  const stepOneRef = useRef<jobSeekerRef>(null);
  const stepTwoRef = useRef<jobSeekerSecRef>(null);
  const stepThreeRef = useRef<jobSeekerThirdRef>(null);

  // @ts-ignore
  const [employeeDetails, setEmployeeDetails] =
    useState<IUserDetailsRequestParams>({} as IUserDetailsRequestParams);
  const [submitUserDetails] = useSubmitUserDetailsMutation();
  const [employeeDocs, setEmployeeDocs] = useState<IDocument[]>();
  const [uploadOtherDocuments] = useSubmitOtherDocumentsMutation();
  const navigation = useNavigation<NavigationProps>();
  const [getUserDetails] = useLazyGetUserQuery();
  const [isSuccessPopupVisible] = useState(false);
  const styles = useThemeAwareObject(getStyles);
  const {insetsBottom, insetsTop} = useScreenInsets();
  const dispatch = useDispatch<AppDispatch>();
  const FlatListRef = useRef<FlatList | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const user = useSelector(userBasicDetailsFromState);
  const popupRef = useRef<customModalRef>(null);
  const toast = useToast();

  const submitUserDetailsHandler = async (
    thirdStepDocs: IDocument[],
    resume: number | null,
  ) => {
    const fields: IUserDetailsRequestParams = {
      name: employeeDetails?.name,
      city: employeeDetails?.city,
      email: employeeDetails?.email,
      phone: employeeDetails?.phone,
      dob: employeeDetails?.dob ?? new Date(),
      selfie: employeeDetails?.selfie ?? [],
      address: employeeDetails?.address,
      gender: employeeDetails?.gender,
      sinNo: employeeDetails?.sinNo,
      workStatus: employeeDetails?.workStatus,
      Emp_id: user?.id ?? 0,
      bankAcNo: employeeDetails?.bankAcNo,
      resume: resume,
      institutionNumber: employeeDetails?.institutionNumber,
      trasitNumber: employeeDetails?.trasitNumber,
    };
    try {
      dispatch(setLoading(true));
      const submitUserDetailsResponse = await submitUserDetails({
        data: fields,
      }).unwrap();
      if (submitUserDetailsResponse) {
        const docs = employeeDocs?.concat(thirdStepDocs);
        const isDocumentsUploaded = await uploadOtherDocHandler(
          docs ?? [],
          submitUserDetailsResponse.detailsId,
        );
        if (isDocumentsUploaded) {
          const userDetails = await getUser();
          if (userDetails) {
            dispatch(updateEmployeeDetails(userDetails));
            navigation.reset({
              index: 0,
              routes: [{name: 'employeeTabBar'}],
            });
          }
        }
      }
    } catch (error) {
      toast.show('Failed to upload Details', {
        type: 'error',
      });
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  };

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
        setEmployeeDetails(prev => ({...prev, ...basicDetails}));
        setCurrentIndex(currentIndex + 1);
        FlatListRef.current?.scrollToIndex({
          animated: true,
          index: currentIndex + 1,
        });
      }
    }

    if (stepTwoRef?.current?.validate && currentIndex === 1) {
      const stepTwoResult = await stepTwoRef!.current!.validate();
      if (stepTwoResult.isValid) {
        setEmployeeDetails(prev => ({...prev, ...stepTwoResult.fields}));
        setEmployeeDocs(prev => [...(prev ?? []), ...stepTwoResult.documents]);
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
        await submitUserDetailsHandler(
          stepThreeResult.documents as any,
          stepThreeResult.resume,
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

  const uploadOtherDocHandler = async (
    otherDocument: IDocument[],
    detailsId: number,
  ): Promise<boolean> => {
    let otherDocs: IOtherDocRequest[] = [];
    otherDocs = otherDocument.map(doc => {
      return {
        name: doc.name,
        Document: doc.Document,
        employee_detail: detailsId,
        Docstatus: IDocumentStatus.PENDING,
      };
    });
    try {
      const otherDocsResponse = await uploadOtherDocuments({
        data: otherDocs,
      }).unwrap();
      if (otherDocsResponse) {
        return true;
      }
      return false;
    } catch (error) {
      console.log(error);
      toast.show('Failed to upload documents', {
        type: 'error',
      });
      return false;
    }
  };

  const getUser = async (): Promise<IEmployeeDetails | null> => {
    try {
      const userDetailsResponse = await getUserDetails(null).unwrap();
      if (user?.user_type === 'emp') {
        const details = userDetailsResponse as IEmployeeDetails;
        return details;
      }
      return null;
    } catch (err) {
      let customError = err as ICustomErrorResponse;
      showToast(
        toast,
        customError?.message ?? STRINGS.someting_went_wrong,
        'error',
      );
      return null;
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
    }, 350);
  };
  return (
    <LinearGradient
      style={[styles.container, {paddingTop: insetsTop}]}
      locations={[0.05, 0.25, 1]}
      colors={['#F9751A', '#FFBB8C', '#FFF']}>
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
