import {StyleSheet, View} from 'react-native';
import React, {useImperativeHandle, useReducer} from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {STRINGS} from 'src/locales/english';
import Spacers from '@components/atoms/Spacers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import DropdownComponent from '@components/molecules/dropdownPopup';
import {eventTypesMock} from '@api/mockData';
import {jobPostStep1Schema} from '@utils/validationSchemas';
import {IJobPostingStepOneFields, IJobPostRef} from './types';
import {ValidationError} from 'yup';
import {verticalScale} from '@utils/metrics';
import EditorTextInputView from '@components/molecules/editorTextInputView';

type IJobPostingStepOneState = {
  jobTitle: string;
  jobDescription: string;
  jobDuties: string;
  jobType: string;
  jobTitleError: string;
  jobDescriptionError: string;
  jobDutiesError: string;
  jobTypeError: string;
};
export type IJobPostingStepOneStatePropsTypes = {
  validate?: () => Promise<{
    fields: IJobPostingStepOneFields | null;
    isValid: boolean;
  }>;
};

const JobPostingStepOne = React.forwardRef<any, IJobPostRef>(({}, ref) => {
  const [jobBasicDetails, setJobBasicDetails] = useReducer(
    (prev: IJobPostingStepOneState, next: IJobPostingStepOneState) => {
      return {...prev, ...next};
    },
    {
      jobTitle: '',
      jobDescription: '',
      jobDuties: '',
      jobType: '',
      jobTitleError: '',
      jobDescriptionError: '',
      jobDutiesError: '',
      jobTypeError: '',
    },
  );

  useImperativeHandle(ref, () => ({
    validate: validate,
  }));

  const validate = async (): Promise<{
    fields: IJobPostingStepOneFields | null;
    isValid: boolean;
  }> => {
    try {
      const fields = await jobPostStep1Schema.validate(jobBasicDetails, {
        abortEarly: false,
      });
      if (fields) {
        return {
          fields: {
            job_name: fields.jobTitle,
            job_type: fields.jobType,
            jobDuties: fields.jobDuties,
            description: fields.jobDescription,
          },
          isValid: true,
        };
      }
      return {fields: null, isValid: false};
    } catch (error) {
      const validationErrors = error as ValidationError;
      if (validationErrors.inner) {
        validationErrors.inner.forEach((err: any) => {
          const field = err.path as keyof IJobPostingStepOneState;
          const errorMessage = err.message;
          setJobBasicDetails({
            ...jobBasicDetails,
            [`${field}Error`]: errorMessage,
          });
        });
      }

      return {fields: null, isValid: false};
    }
  };

  const handleValueChange = (key: string, value: string) => {
    setJobBasicDetails({
      ...jobBasicDetails,
      [key]: value,
      [`${key}Error`]: '',
    });
  };

  return (
    <View style={styles.inputContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
        enableAutomaticScroll
        extraHeight={verticalScale(200)}
        enableResetScrollToCoords={true}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always">
        <CustomTextInput
          value={jobBasicDetails.jobTitle}
          onTextChange={value =>
            handleValueChange(Object.keys(jobBasicDetails)[0], value)
          }
          title={STRINGS.job_title}
          errorMessage={jobBasicDetails.jobTitleError}
        />
        <Spacers type={'vertical'} size={16} />
        <EditorTextInputView
          label={STRINGS.jobDescription}
          errorMessage={jobBasicDetails.jobDescriptionError}
          getEnteredText={text =>
            handleValueChange(Object.keys(jobBasicDetails)[1], text)
          }
        />
        <Spacers type={'vertical'} size={16} />
        <EditorTextInputView
          label={STRINGS.jobDuties}
          errorMessage={jobBasicDetails.jobDutiesError}
          getEnteredText={text =>
            handleValueChange(Object.keys(jobBasicDetails)[2], text)
          }
        />
        <Spacers type={'vertical'} size={16} />
        <DropdownComponent
          title={STRINGS.job_type}
          onChangeValue={e =>
            handleValueChange(Object.keys(jobBasicDetails)[3], e.value)
          }
          error={jobBasicDetails.jobTypeError}
          value={jobBasicDetails.jobType}
          data={eventTypesMock}
        />
        <Spacers type={'vertical'} size={16} />
      </KeyboardAwareScrollView>
    </View>
  );
});

export default JobPostingStepOne;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
  },
  multiline: {height: verticalScale(200)},
  textInput: {
    paddingTop: verticalScale(10),
    height: '100%',
  },
});
