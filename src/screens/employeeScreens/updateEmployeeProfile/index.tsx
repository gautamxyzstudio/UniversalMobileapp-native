/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import {Alert, RefreshControl, StatusBar, StyleSheet, View} from 'react-native';
import React, {useEffect, useReducer, useRef, useState} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {fonts} from '@utils/common.styles';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '@components/atoms/customtextInput';
import {verticalScale} from '@utils/metrics';
import PhoneNumberInput from '@components/molecules/InputTypes/PhoneNumberInput';
import {IDefaultValues, updateEmployeeProfileProfile} from './types';
import BottomButtonView from '@components/organisms/bottomButtonView';
import UploadProfilePhoto from '@components/molecules/uploadProfilePhoto';
import {mockGenders, provincesAndCities} from '@api/mockData';
import Spacers from '@components/atoms/Spacers';
import DropdownComponent from '@components/molecules/dropdownPopup';
import {
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {
  useLazyGetUserQuery,
  useUpdateEmployeeDetailsMutation,
} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {useToast} from 'react-native-toast-notifications';
import {IEmployeeDetails} from '@api/features/user/types';
import {showToast} from '@components/organisms/customToast';
import {updateEmployeeDetails} from '@api/features/user/userSlice';
import LocationInput from '@components/molecules/InputTypes/locationInput';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {useTheme} from '@theme/Theme.context';

const UpdateEmployeeProfile = () => {
  const userBasicDetails = useSelector(userBasicDetailsFromState);

  const [defaultValues, setDefaultValues] = useState<IDefaultValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    selfie: [],
    city: '',
  });
  const userDetails = useSelector(
    userAdvanceDetailsFromState,
  ) as IEmployeeDetails;
  const reduxDispatch = useDispatch();
  const [updateDetails] = useUpdateEmployeeDetailsMutation();
  const [changedFields, setChangedField] = useState<Partial<IDefaultValues>>(
    {},
  );
  const [refreshing, updateRefreshing] = useState(false);
  const [getUserDetails] = useLazyGetUserQuery();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const toast = useToast();
  const bottomSheetRef = useRef<BottomSheetModalMethods | null>(null);
  const {theme} = useTheme();
  const locationInputPressHandler = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const [state, dispatch] = useReducer(
    (
      prev: updateEmployeeProfileProfile,
      next: updateEmployeeProfileProfile,
    ) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      name: '',
      nameError: '',
      selfie: [],
      email: '',
      emailError: '',
      phone: '',
      phoneError: '',
      address: '',
      addressError: '',
      gender: '',
      city: '',
      cityError: '',
    },
  );

  useEffect(() => {
    setDefaultValues({
      name: userDetails?.name ?? '',
      email: userBasicDetails?.email ?? '',
      phone: userDetails?.phone ?? '',
      address: userDetails?.address ?? '',
      gender: userDetails?.gender ?? '',
      city: userDetails?.city ?? '',
      selfie: userDetails?.selfie,
    });
    dispatch({
      ...state,
      name: userDetails?.name ?? '',
      email: userBasicDetails?.email ?? '',
      phone: userDetails?.phone ?? '',
      address: userDetails?.address ?? '',
      gender: userDetails?.gender ?? '',
      selfie: userDetails?.selfie,
      city: userDetails?.city ?? '',
    });
  }, [userDetails]);

  useEffect(() => {
    const myOBj = {
      name: state.name,
      email: state.email,
      phone: state.phone,
      address: state.address,
      gender: state.gender,
      city: state.city,
      selfie: state.selfie,
    };
    setIsButtonEnabled(JSON.stringify(myOBj) !== JSON.stringify(defaultValues));
  }, [state, defaultValues, userDetails]);

  // to refresh user details on pull to refresh
  const fetchUserDetailsHandler = async () => {
    try {
      const response = (await getUserDetails(
        null,
      ).unwrap()) as IEmployeeDetails;
      reduxDispatch(updateEmployeeDetails(response));
    } catch (error) {
      showToast(toast, STRINGS.unable_to_fetch_user_details, 'error');
    } finally {
      updateRefreshing(false);
    }
  };

  const onRefresh = () => {
    updateRefreshing(true);
    fetchUserDetailsHandler();
  };

  const handleInputChange = (field: keyof IDefaultValues, value: any) => {
    dispatch({
      ...state,
      [field]: value,
      [`${field}Error`]: '',
    });

    setChangedField(prev => {
      if (value !== defaultValues[field]) {
        return {...prev, [field]: value};
      } else {
        const {[field]: _, ...rest} = prev;
        return rest;
      }
    });
  };

  const updateEmployee = async () => {
    let isValid = true;
    Object.keys(changedFields).forEach(field => {
      const value = changedFields[field as keyof IDefaultValues];

      if (!value || value.toString().trim() === '') {
        isValid = false;
        dispatch({...state, [`${field}Error`]: `${field} is required`});
      }
    });

    if (isValid) {
      reduxDispatch(setLoading(true));
      try {
        const updatedDetails = await updateDetails({
          data: {
            data: changedFields,
            docId: userDetails?.detailsId ?? 0,
          },
        }).unwrap();
        if (updatedDetails) {
          fetchUserDetailsHandler();
          showToast(toast, 'Profile Updated Successfully', 'success');
        }
      } catch (error) {
        showToast(
          toast,
          'Failed to update details please try again later',
          'error',
        );
      } finally {
        reduxDispatch(setLoading(false));
      }
    }
  };

  return (
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack
        isDark
        headerTitleStyles={styles.title}
        headerTitle={STRINGS.my_Accounts}
      />
      <KeyboardAwareScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}>
        <View style={styles.view}>
          <UploadProfilePhoto
            getUploadedImageIds={ids => handleInputChange('selfie', ids)}
            initialImage={userDetails?.selfie}
          />
          <CustomTextInput
            value={state.name}
            onTextChange={e => handleInputChange('name', e)}
            title={STRINGS.name}
            errorMessage={state.nameError}
          />
          <CustomTextInput
            value={state.email}
            onTextChange={e => handleInputChange('email', e)}
            title={STRINGS.email}
            editable={false}
            keyboardType="email-address"
            autoCapitalize="none"
            errorMessage={state.emailError}
          />
          <PhoneNumberInput
            withCode={true}
            value={state.phone}
            getSelectedPhoneNumber={(e: any) => handleInputChange('phone', e)}
            errorMessage={state.phoneError}
          />
          <CustomTextInput
            value={state.address}
            title={STRINGS.address}
            onTextChange={e => handleInputChange('address', e)}
            errorMessage={state.addressError}
          />
          <LocationInput
            onPress={locationInputPressHandler}
            value={state.city}
            errorMessage={state.cityError}
          />
          <DropdownComponent
            title={STRINGS.gender}
            onChangeValue={e => handleInputChange('gender', e.value)}
            value={state.gender}
            data={mockGenders}
            error={''}
          />
        </View>
        <Spacers type={'vertical'} size={48} />
      </KeyboardAwareScrollView>
      <BottomButtonView
        title={STRINGS.save}
        disabled={!isButtonEnabled}
        onButtonPress={updateEmployee}
      />
      <FilterListBottomSheet
        ref={bottomSheetRef}
        selectionType="singleOptionSelect"
        filters={provincesAndCities}
        snapPoints={[0.01, verticalScale(698)]}
        getAppliedFilters={filters => handleInputChange('city', filters[0])}
      />
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={theme.color.primary}
      />
    </SafeAreaView>
  );
};

export default UpdateEmployeeProfile;

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
