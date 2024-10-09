/* eslint-disable react-hooks/exhaustive-deps */
import {StyleSheet, View} from 'react-native';
import React, {useEffect, useReducer, useState} from 'react';
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
import {mockGenders, mockWorkStatus} from '@api/mockData';
import Spacers from '@components/atoms/Spacers';
import DropdownComponent from '@components/molecules/dropdownPopup';
import {
  userAdvanceDetailsFromState,
  userBasicDetailsFromState,
} from '@api/features/user/userSlice';
import {useDispatch, useSelector} from 'react-redux';
import {useUpdateEmployeeDetailsMutation} from '@api/features/user/userApi';
import {setLoading} from '@api/features/loading/loadingSlice';
import {useToast} from 'react-native-toast-notifications';
import {IEmployeeDetails} from '@api/features/user/types';

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
    workStatus: '',
  });
  const userDetails = useSelector(
    userAdvanceDetailsFromState,
  ) as IEmployeeDetails;
  const reduxDispatch = useDispatch();
  const [updateDetails] = useUpdateEmployeeDetailsMutation();
  const [changedFields, setChangedField] = useState<IDefaultValues>({
    name: '',
    email: '',
    phone: '',
    address: '',
    gender: '',
    selfie: [],
    city: '',
    workStatus: '',
  });
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const toast = useToast();
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
      workStatus: '',
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
      workStatus: userDetails?.workStatus ?? '',
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
      workStatus: userDetails?.workStatus ?? '',
    });
  }, []);

  console.log(defaultValues, 'SLEE');

  useEffect(() => {
    const myOBj = {
      name: state.name,
      email: state.email,
      phone: state.phone,
      address: state.address,
      gender: state.gender,
      city: state.city,
      selfie: state.selfie,
      workStatus: state.workStatus,
    };
    setIsButtonEnabled(JSON.stringify(myOBj) !== JSON.stringify(defaultValues));
  }, [state, defaultValues]);

  const handleInputChange = (field: keyof IDefaultValues, value: any) => {
    console.log(field, value);

    dispatch({
      ...state,
      [field]: value,
      [`${field}Error`]: '',
    });

    if (value !== defaultValues[field]) {
      setChangedField(prev => ({...prev, [field]: value}));
    } else if (value === defaultValues[field]) {
      setChangedField(prev => {
        const preValues = {...prev};
        delete preValues[field];
        return preValues;
      });
    }
  };

  const updateEmployeeDetails = async () => {
    let isValid = true;
    Object.keys(changedFields).forEach(field => {
      // @ts-ignore
      const value = changedFields[field].value;
      if (!value || value.trim() === '') {
        isValid = false;
        dispatch({...state, [`${field}Error`]: `${field} is required`});
      }
    });
    console.log(isValid);
    if (isValid) {
      try {
        reduxDispatch(setLoading(true));
        const updatedDetails = await updateDetails({
          data: {
            data: changedFields,
            docId: userDetails?.detailsId ?? 0,
          },
        }).unwrap();
        if (updatedDetails) {
          console.log(updatedDetails, 'update');
          // reduxDispatch(updateEmployeeDetails(changedFields));
        }
      } catch (error) {
        toast.hideAll();
        toast.show('Failed to update details please try again later', {
          type: 'error',
        });
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
      <KeyboardAwareScrollView showsVerticalScrollIndicator={false}>
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
            isDisabled
            withCode={false}
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
          <CustomTextInput
            value={state.city}
            title={STRINGS.city}
            onTextChange={e => handleInputChange('city', e)}
            errorMessage={state.cityError}
          />
          <DropdownComponent
            title={STRINGS.gender}
            onChangeValue={e => handleInputChange('gender', e.value)}
            value={state.gender}
            data={mockGenders}
            error={''}
          />
          <DropdownComponent
            title={STRINGS.work_status}
            onChangeValue={e => handleInputChange('workStatus', e.value)}
            error={''}
            value={state.workStatus}
            data={mockWorkStatus}
          />
        </View>
        <Spacers type={'vertical'} size={48} />
      </KeyboardAwareScrollView>
      <BottomButtonView
        title={STRINGS.save}
        disabled={!isButtonEnabled}
        onButtonPress={updateEmployeeDetails}
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
