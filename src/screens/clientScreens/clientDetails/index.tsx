import {StyleSheet, View} from 'react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import {IClientDetailsState} from './types';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {fonts} from '@utils/common.styles';
import {STRINGS} from 'src/locales/english';
import CustomTextInput from '@components/atoms/customtextInput';
import PhoneNumberInput from '@components/molecules/InputTypes/PhoneNumberInput';
import LocationInput from '@components/molecules/InputTypes/locationInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {verticalScale} from '@utils/metrics';
import {provincesAndCities} from '@api/mockData';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateClientDetails,
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {IClientDetails} from '@api/features/user/types';
import {useUpdateClientDetailsMutation} from '@api/features/client/clientApi';
import {withAsyncErrorHandlingPost} from '@utils/constants';
import {useToast} from 'react-native-toast-notifications';
import {showToast} from '@components/organisms/customToast';

const ClientDetails = () => {
  const initialState: IClientDetailsState = {
    name: '',
    contactNumber: '',
    city: '',
    nameError: '',
    contactNumberError: '',
    email: '',
    companyName: '',
    industry: '',
    cityError: '',
  };
  const [state, dispatch] = useReducer(
    (prev: IClientDetailsState, next: IClientDetailsState) => {
      return {...prev, ...next};
    },
    initialState,
  );
  const toast = useToast();
  const reduxDispatch = useDispatch();
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [initialValue, setInitialValues] = useState<{
    name: string;
    contactNumber: string;
    city: string;
  }>({
    name: '',
    contactNumber: '',
    city: '',
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const user = useSelector(userAdvanceDetailsFromState) as IClientDetails;
  const [updateDetails] = useUpdateClientDetailsMutation();
  const userBasic = useSelector(userBasicDetailsFromState);
  const handleInputChange = (field: keyof IClientDetailsState, value: any) => {
    dispatch({
      ...state,
      [field]: value,
      [`${field}Error`]: '',
    });
  };

  const updateClientDetailsHandler = withAsyncErrorHandlingPost(
    async () => {
      const name = state.name.trim();
      const phone = state.contactNumber.trim();
      const city = state.city.trim();
      let isValid = true;
      if (name === '') {
        dispatch({...state, nameError: STRINGS.name_required});
        isValid = false;
      }
      if (phone === '') {
        dispatch({...state, contactNumberError: STRINGS.contact_required});
        isValid = false;
      }
      if (city === '') {
        dispatch({...state, contactNumberError: STRINGS.city_required});
        isValid = false;
      }
      if (isValid && user.detailsId) {
        const updateDetailsResponse = await updateDetails({
          userId: user.detailsId,
          clientDetails: {
            Name: name,
            location: city,
            contactno: phone,
          },
        }).unwrap();
        if (updateDetailsResponse) {
          reduxDispatch(
            updateClientDetails({
              name: updateDetailsResponse.Name,
              contactNo: updateDetailsResponse.contactno,
              location: updateDetailsResponse.location,
            }),
          );
          showToast(toast, STRINGS.details_updated, 'success');
        }
      }
    },
    toast,
    reduxDispatch,
  );
  useEffect(() => {
    if (user) {
      dispatch({
        ...state,
        name: user?.name ?? '',
        contactNumber: user.contactNo ?? '',
        email: userBasic?.email ?? '',
        companyName: user.company?.companyname ?? '',
        industry: user.industry,
        city: user.location,
      });
      setInitialValues({
        name: user?.name ?? '',
        contactNumber: user.contactNo ?? '',
        city: user.location,
      });
    }
  }, [user]);

  useEffect(() => {
    const myOBj = {
      name: state.name,
      contactNumber: state.contactNumber,
      city: state.city,
    };
    setIsButtonEnabled(JSON.stringify(myOBj) !== JSON.stringify(initialValue));
  }, [state, initialValue]);

  return (
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack
        isDark
        headerTitleStyles={styles.title}
        headerTitle={STRINGS.my_Accounts}
      />
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.view}>
          <CustomTextInput
            value={state.name}
            onTextChange={e => handleInputChange('name', e)}
            title={STRINGS.name}
            errorMessage={state.nameError}
          />
          <PhoneNumberInput
            withCode={true}
            getSelectedPhoneNumber={number =>
              handleInputChange('contactNumber', number)
            }
            value={state.contactNumber}
            errorMessage={state.contactNumberError}
          />
          <LocationInput
            onPress={() => bottomSheetRef.current?.snapToIndex(1)}
            value={state.city}
            errorMessage={state.cityError}
          />
          <CustomTextInput
            value={state.email}
            title={STRINGS.email}
            editable={false}
            errorMessage={''}
          />
          <CustomTextInput
            value={state.companyName}
            title={STRINGS.company_name}
            editable={false}
            errorMessage={''}
          />
          <CustomTextInput
            value={state.industry}
            title={STRINGS.industry}
            editable={false}
            errorMessage={''}
          />
        </View>
        <FilterListBottomSheet
          ref={bottomSheetRef}
          buttonTitle={STRINGS.select}
          filters={provincesAndCities}
          withClearButton={false}
          snapPoints={[0.01, verticalScale(698)]}
          title={STRINGS.select_location}
          selectionType="singleOptionSelect"
          getAppliedFilters={value =>
            dispatch({...state, city: value[0], cityError: ''})
          }
        />
      </KeyboardAwareScrollView>
      <BottomButtonView
        title={STRINGS.save}
        onButtonPress={updateClientDetailsHandler}
        disabled={!isButtonEnabled}
      />
    </SafeAreaView>
  );
};

export default ClientDetails;

const styles = StyleSheet.create({
  title: {
    ...fonts.headingSmall,
  },
  view: {
    gap: verticalScale(16),
    flex: 1,
    marginTop: verticalScale(30),
  },
});
