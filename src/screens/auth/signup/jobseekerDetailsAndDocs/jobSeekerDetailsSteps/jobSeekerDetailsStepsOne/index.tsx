import {
  Platform,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  findNodeHandle,
} from 'react-native';
import React, {
  forwardRef,
  memo,
  useCallback,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import UploadProfilePhoto from '@components/molecules/uploadProfilePhoto';
import {STRINGS} from 'src/locales/english';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import DropdownComponent from '@components/molecules/dropdownPopup';
import {IJobSeekerDetailsStepsOneState, jobSeekerRef} from './types';
import CustomTextInput from '@components/atoms/customtextInput';
import Spacers from '@components/atoms/Spacers';
import PhoneNumberInput from '@components/molecules/InputTypes/PhoneNumberInput';
import DatePickerInput from '@components/molecules/datepickerInput';
import {mockGenders, provincesAndCities} from '@api/mockData';
import {userDetailsStep1Schema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import {useSelector} from 'react-redux';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';
import LocationInput from '@components/molecules/InputTypes/locationInput';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import FilterListBottomSheet from '@components/molecules/filterListBottomSheet';
import {verticalScale} from '@utils/metrics';
import {useTheme} from '@theme/Theme.context';

const JobSeekerDetailsStepsOne = forwardRef<{}, jobSeekerRef>((props, ref) => {
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const nameRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const dobRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const {theme} = useTheme();
  const cityRef = useRef<TextInput>(null);
  const genderRef = useRef<TextInput>(null);
  const userDetails = useSelector(userBasicDetailsFromState);
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const [state, setState] = useReducer(
    (
      prev: IJobSeekerDetailsStepsOneState,
      next: IJobSeekerDetailsStepsOneState,
    ) => {
      return {
        ...prev,
        ...next,
      };
    },
    {
      name: '',
      nameError: '',
      city: '',
      email: userDetails?.email ?? '',
      emailError: '',
      selfie: [],
      phone: '9646106068',
      gender: '',
      genderError: '',
      address: '',
      addressError: '',
      dob: null,
      dobError: '',
      phoneError: '',
      cityError: '',
    },
  );

  const displayModal = useCallback(
    () => bottomSheetRef.current?.snapToIndex(1),
    [],
  );

  useImperativeHandle(ref, () => ({
    validate: validate,
  }));

  const validate = async () => {
    try {
      const fields = await userDetailsStep1Schema.validate(state, {
        abortEarly: false,
      });
      return {
        fields: {
          name: fields.name,
          email: userDetails?.email,
          selfie: state.selfie,
          phone: '9646106068',
          dob: fields.dob.toISOString(),
          city: fields.city,
          address: fields.address,
          gender: fields.gender,
        },
        isValid: true,
      };
    } catch (error) {
      const validationErrors = error as ValidationError;
      if (validationErrors.inner[0].path === 'name') {
        setState({...state, nameError: validationErrors.inner[0].message});
        nameRef.current?.focus();
        scrollViewRef.current?.scrollToFocusedInput(
          findNodeHandle(nameRef.current) as number,
          0,
          0,
        );
      } else if (validationErrors.inner[0].path === 'phone') {
        setState({
          ...state,
          phoneError: validationErrors.inner[0].message,
        });
      } else if (validationErrors.inner[0].path === 'dob') {
        setState({
          ...state,
          dobError: validationErrors.inner[0].message,
        });
        dobRef.current?.measure((x, y) => {
          scrollViewRef.current?.scrollToPosition(x, y, true);
        });
      } else if (validationErrors.inner[0].path === 'address') {
        setState({
          ...state,
          addressError: validationErrors.inner[0].message,
        });
        addressRef.current?.focus();
        scrollViewRef.current?.scrollToFocusedInput(
          findNodeHandle(addressRef.current) as number,
          0,
          0,
        );
      } else if (validationErrors.inner[0].path === 'city') {
        setState({
          ...state,
          cityError: validationErrors.inner[0].message,
        });
        cityRef.current?.focus();
        scrollViewRef.current?.scrollToFocusedInput(
          findNodeHandle(cityRef.current) as number,
          0,
          0,
        );
      } else if (validationErrors.inner[0].path === 'gender') {
        setState({
          ...state,
          genderError: validationErrors.inner[0].message,
        });
        scrollViewRef.current?.scrollToEnd();
      }
    }
    return {
      fields: null,
      isValid: false,
    };
  };

  return (
    <View style={styles.inputContainer}>
      <KeyboardAwareScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        enableResetScrollToCoords={false}>
        <UploadProfilePhoto
          getUploadedImageIds={ids => setState({...state, selfie: ids})}
        />
        <Spacers type={'vertical'} size={24} />
        <CustomTextInput
          value={state.name}
          ref={nameRef}
          title={STRINGS.name}
          errorMessage={state.nameError}
          onChangeText={e => setState({...state, name: e, nameError: ''})}
        />
        <Spacers type={'vertical'} size={16} />
        <CustomTextInput
          value={state.email}
          title={STRINGS.email}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={false}
          errorMessage={state.emailError}
          onChangeText={e => setState({...state, email: e, emailError: ''})}
        />
        <Spacers type={'vertical'} size={16} />
        <PhoneNumberInput
          value={state.phone}
          getSelectedPhoneNumber={number =>
            setState({...state, phone: number, phoneError: ''})
          }
          errorMessage={state.phoneError}
          compRef={phoneRef}
        />
        <Spacers type={'vertical'} size={16} />
        <DatePickerInput
          currentDate={null}
          minimumDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 60))
          }
          maximumDate={
            new Date(new Date().setFullYear(new Date().getFullYear() - 18))
          }
          errorMessage={state.dobError}
          getSelectedDate={date =>
            setState({...state, dob: date, dobError: ''})
          }
        />
        <Spacers type={'vertical'} size={16} />
        <CustomTextInput
          value={state.address}
          title={STRINGS.address}
          ref={addressRef}
          errorMessage={state.addressError}
          onChangeText={e => setState({...state, address: e, addressError: ''})}
        />
        <Spacers type={'vertical'} size={16} />
        <LocationInput
          onPress={displayModal}
          value={state.city}
          errorMessage={state.cityError}
        />
        <Spacers type={'vertical'} size={16} />
        <DropdownComponent
          title={STRINGS.gender}
          compRef={genderRef}
          onChangeValue={e =>
            setState({...state, gender: e.value, genderError: ''})
          }
          error={state.genderError}
          value={state.gender}
          data={mockGenders}
        />
        <Spacers type={'vertical'} size={16} />
        <Spacers type={'vertical'} size={48} />
        <FilterListBottomSheet
          ref={bottomSheetRef}
          buttonTitle={STRINGS.select}
          filters={provincesAndCities}
          snapPoints={[0.01, verticalScale(698)]}
          title={STRINGS.select_location}
          withClearButton={false}
          selectionType="singleOptionSelect"
          getAppliedFilters={value =>
            setState({...state, city: value[0], cityError: ''})
          }
        />
      </KeyboardAwareScrollView>
    </View>
  );
});

export default memo(JobSeekerDetailsStepsOne);

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
  },

  spacer: {
    marginTop: 16,
  },
});
