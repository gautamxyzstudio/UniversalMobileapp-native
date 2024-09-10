import {StyleSheet, View} from 'react-native';
import React, {useImperativeHandle, useReducer, useRef} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomTextInput from '@components/atoms/customtextInput';
import {STRINGS} from 'src/locales/english';
import Spacers from '@components/atoms/Spacers';
import {genderPreferences, paymentSchedulesMockData} from '@api/mockData';
import DropdownComponent from '@components/molecules/dropdownPopup';
import SelectCertificateInput from '@components/client/SelectCertificateInput';
import AddCertificatePopup from '@components/molecules/addCertificatePopup';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {IJobPostingStepThreeFields, IJobPostRef} from './types';
import {jobPostStep3Schema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';

type IJobPostingStepThreeState = {
  requiredEmployee: string;
  salary: string;
  paymentDuration: string;
  requiredCertificates: string[];
  experienceRequired: string;
  gender: string;
  requiredEmployeeError: string;
  salaryError: string;
  paymentDurationError: string;
  experienceRequiredError: string;
  requiredCertificatesError: string;
  genderError: string;
};

const JobPostingStepThree = React.forwardRef<any, IJobPostRef>(({}, ref) => {
  const certificatesPopupRef = useRef<BottomSheetModal | null>(null);
  const styles = useThemeAwareObject(createStyles);
  const [state, dispatch] = useReducer(
    (prev: IJobPostingStepThreeState, next: IJobPostingStepThreeState) => {
      return {...prev, ...next};
    },
    {
      requiredEmployee: '',
      salary: '',
      paymentDuration: paymentSchedulesMockData[0].value,
      requiredCertificates: [STRINGS.sinDocument],
      experienceRequired: '',
      gender: genderPreferences[2].value,
      requiredEmployeeError: '',
      salaryError: '',
      paymentDurationError: '',
      requiredCertificatesError: '',
      experienceRequiredError: '',
      genderError: '',
    },
  );

  useImperativeHandle(ref, () => ({
    validate: validate,
  }));

  const validate = async (): Promise<{
    fields: IJobPostingStepThreeFields | null;
    isValid: boolean;
  }> => {
    try {
      const fields = await jobPostStep3Schema.validate(state, {
        abortEarly: false,
      });
      if (fields) {
        return {
          fields: {
            gender: state.gender,
            salary: fields.salary,
            requiredEmployee: fields.requiredEmployee,
            PaymentType: state.paymentDuration,
            experience: Number(state.experienceRequired),
            required_certificates: state.requiredCertificates,
          },
          isValid: true,
        };
      }
      return {fields: null, isValid: false};
    } catch (error) {
      const validationErrors = error as ValidationError;
      if (validationErrors.inner) {
        validationErrors.inner.forEach((err: any) => {
          const field = err.path as keyof IJobPostingStepThreeFields;
          const errorMessage = err.message;
          dispatch({
            ...state,
            [`${field}Error`]: errorMessage,
          });
        });
      }

      return {fields: null, isValid: false};
    }
  };

  const onPressAddCertificate = () => {
    certificatesPopupRef.current?.snapToIndex(1);
  };

  const certificatesHandler = (certificates: string[]) => {
    dispatch({
      ...state,
      requiredCertificates: certificates,
      requiredCertificatesError: '',
    });
  };

  const handleValueChange = (key: string, value: string) => {
    dispatch({
      ...state,
      [key]: value,
      [`${key}Error`]: '',
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.containerSec}
        enableAutomaticScroll
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <CustomTextInput
          title={STRINGS.number_of_employees_needed}
          value={state.requiredEmployee}
          maxLength={4}
          onTextChange={text => handleValueChange(Object.keys(state)[0], text)}
          keyboardType="number-pad"
          errorMessage={state.requiredEmployeeError}
        />
        <Spacers type={'vertical'} size={16} />
        <DropdownComponent
          title={STRINGS.payment_Schedule}
          dropdownPosition="top"
          onChangeValue={e => handleValueChange(Object.keys(state)[2], e.value)}
          error={state.paymentDurationError}
          value={state.paymentDuration}
          data={paymentSchedulesMockData}
        />
        <Spacers type={'vertical'} size={16} />
        <CustomTextInput
          value={state.salary}
          title={STRINGS.starting_wage}
          onTextChange={text => handleValueChange(Object.keys(state)[1], text)}
          keyboardType="numeric"
          errorMessage={state.salaryError}
        />
        <Spacers type={'vertical'} size={16} />
        <SelectCertificateInput
          initiallySelectedCertificates={state.requiredCertificates}
          onPressAdd={onPressAddCertificate}
          error={''}
          getUpdatedCertificate={certificatesHandler}
        />
        <Spacers type={'vertical'} size={16} />
        <CustomTextInput
          title={STRINGS.years_of_experience}
          value={state.experienceRequired}
          maxLength={3}
          onTextChange={e => handleValueChange(Object.keys(state)[4], e)}
          keyboardType="numeric"
          errorMessage={''}
        />
        <Spacers type={'vertical'} size={16} />
        <DropdownComponent
          title={STRINGS.gender_optional}
          dropdownPosition="top"
          onChangeValue={e => handleValueChange(Object.keys(state)[5], e.value)}
          error={''}
          value={state.gender}
          data={genderPreferences}
        />
        <Spacers type={'vertical'} size={16} />
        <AddCertificatePopup
          ref={certificatesPopupRef}
          getAddedCertificate={certificates =>
            certificatesHandler(certificates)
          }
          addedCertificate={state.requiredCertificates}
        />
      </KeyboardAwareScrollView>
    </View>
  );
});

export default JobPostingStepThree;
const createStyles = () =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    containerSec: {
      flexGrow: 1,
    },
  });
