import {StyleSheet} from 'react-native';
import React, {useReducer, useRef} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {STRINGS} from 'src/locales/english';
import CustomTextInput from '@components/atoms/customtextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import Spacers from '@components/atoms/Spacers';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {IStateRecruiterProps} from './types';
import LocationInput from '@components/molecules/InputTypes/locationInput';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {provincesAndCities} from '@api/mockData';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {clientDetailsSchema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import {LOGOUT_SECONDARY, LOGOUT_WHITE} from '@assets/exporter';
import ActionPopup from '@components/molecules/ActionPopup';
import {customModalRef} from '@components/molecules/customModal/types';
import store from '@api/store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateClientDetails,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';

import {IClientDetails} from '@api/features/user/types';
import {setLoading} from '@api/features/loading/loadingSlice';
import {ICustomErrorResponse} from '@api/types';
import {useToast} from 'react-native-toast-notifications';
import {useAddClientDetailsMutation} from '@api/features/user/userApi';
import PhoneNumberInput from '@components/molecules/InputTypes/PhoneNumberInput';
import {timeOutTimeSheets} from 'src/constants/constants';

const RecruiterDetails = () => {
  const styles = useThemeAwareObject(getStyles);
  const bottomSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const popupRef = useRef<customModalRef>(null);
  const reduxDispatch = useDispatch();
  const navigation = useNavigation<NavigationProps>();
  const [addDetails] = useAddClientDetailsMutation();
  const toast = useToast();
  const user = useSelector(userBasicDetailsFromState);
  const [state, dispatch] = useReducer(
    (prev: IStateRecruiterProps, next: IStateRecruiterProps) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      name: '',
      email: user?.email ?? '',
      location: '',
      locationError: '',
      industry: '',
      industryError: '',
      company: '',
      nameError: '',
      phoneNumber: '9646106068',
      phoneNumberError: '',
      companyError: '',
    },
  );

  const locationInputPressHandler = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const onPressLogoutButton = () => {
    popupRef.current?.handleModalState(true);
  };

  const onSubmitForm = async () => {
    try {
      const fields = await clientDetailsSchema.validate(
        {...state, phone: '9646106068'},
        {
          abortEarly: false,
        },
      );
      if (fields) {
        try {
          reduxDispatch(setLoading(true));
          const response = await addDetails({
            data: {
              Name: fields.name,
              Email: user?.email ?? '',
              contactno: fields.phone,
              companyname: fields.company,
              status: 'pending',
              location: fields.location,
              Industry: fields.industry,
              clien_id: user?.id ?? 0,
              jobs: [],
            },
          }).unwrap();
          if (response) {
            const details: IClientDetails = {
              name: response.data.attributes?.Name ?? '',
              companyName: response.data.attributes?.companyname ?? '',
              industry: response.data.attributes?.Industry ?? '',
              detailsId: response.data.id ?? 0,
              location: response.data.attributes?.location ?? '',
              contactNo: response.data.attributes?.contactno ?? '',
              status: response.data.attributes?.status ?? '',
            };
            reduxDispatch(updateClientDetails(details));
            navigation.reset({
              index: 0,
              routes: [{name: 'approval'}],
            });
          }
        } catch (error) {
          const customError = error as ICustomErrorResponse;
          toast.show(`${customError.message}`, {type: 'error'});
        } finally {
          reduxDispatch(setLoading(false));
        }
      }
    } catch (error) {
      const validationErrors = error as ValidationError;
      const errors: {[key: string]: string} = {};
      validationErrors.inner.forEach(err => {
        if (err.path) {
          errors[err.path] = err.message;
        }
      });
      dispatch({
        ...state,
        nameError: errors.name,
        phoneNumberError: errors.phone,
        companyError: errors.company,
        locationError: errors.location,
        industryError: errors.industry,
      });
    }
  };

  const onPressLogout = () => {
    popupRef.current?.handleModalState(false);
    setTimeout(() => {
      store.dispatch({type: 'RESET'});
      navigation.reset({
        index: 0,
        routes: [{name: 'onBoarding'}],
      });
    }, timeOutTimeSheets);
  };

  return (
    <OnBoardingBackground
      hideBack
      displayRightIcon
      rightIcon={LOGOUT_WHITE}
      rightIconPressHandler={onPressLogoutButton}
      title={STRINGS.details}>
      <KeyboardAwareScrollView
        keyboardOpeningTime={10}
        contentInsetAdjustmentBehavior="never"
        contentContainerStyle={styles.main}
        showsVerticalScrollIndicator={false}>
        <CustomTextInput
          title={STRINGS.name}
          onTextChange={e => dispatch({...state, name: e, nameError: ''})}
          value={state.name}
          errorMessage={state.nameError}
        />
        <Spacers type="vertical" size={16} />
        <CustomTextInput
          title={STRINGS.company_name}
          onTextChange={e => dispatch({...state, company: e, companyError: ''})}
          value={state.company}
          errorMessage={state.companyError}
        />
        <Spacers type="vertical" size={16} />
        <CustomTextInput
          title={STRINGS.email}
          editable={false}
          value={state.email}
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={''}
        />
        <Spacers type="vertical" size={16} />
        <PhoneNumberInput
          value="8054468711"
          getSelectedPhoneNumber={e =>
            dispatch({...state, phoneNumber: e, phoneNumberError: ''})
          }
          errorMessage={state.phoneNumberError}
        />
        <Spacers type="vertical" size={16} />
        <LocationInput
          onPress={locationInputPressHandler}
          value={state.location}
          errorMessage={state.locationError}
        />
        <Spacers type="vertical" size={16} />
        <CustomTextInput
          title={STRINGS.industry}
          value={state.industry}
          onTextChange={e =>
            dispatch({...state, industry: e, industryError: ''})
          }
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={state.industryError}
        />
      </KeyboardAwareScrollView>

      <BottomButtonView
        disabled={false}
        title={STRINGS.submit}
        onButtonPress={onSubmitForm}
      />
      <FilterListBottomSheet
        ref={bottomSheetRef}
        isMultiSelect={false}
        filters={provincesAndCities}
        snapPoints={[0.01, verticalScale(698)]}
        getAppliedFilters={filters =>
          dispatch({...state, location: filters[0], locationError: ''})
        }
      />
      <ActionPopup
        ref={popupRef}
        title={STRINGS.are_you_sure_you_want_to_logout_this_account}
        buttonTitle={STRINGS.logOut}
        icon={LOGOUT_SECONDARY}
        buttonPressHandler={onPressLogout}
        type={'error'}
      />
    </OnBoardingBackground>
  );
};

export default RecruiterDetails;

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    spacer: {
      height: verticalScale(16),
    },

    main: {flexGrow: 1},
    top: {marginTop: 12},
    bottomView: {
      alignSelf: 'center',
      width: '100%',
      backgroundColor: colors.color.primary,
      paddingTop: verticalScale(20),
    },
    bottom: {
      marginTop: verticalScale(14),
      alignSelf: 'center',
    },
  });
  return styles;
};
