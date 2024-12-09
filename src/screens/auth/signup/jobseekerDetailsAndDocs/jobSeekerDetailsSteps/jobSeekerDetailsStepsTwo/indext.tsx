import {StyleSheet, TextInput, View, findNodeHandle} from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useReducer,
  useRef,
} from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {jobSeekerDetailsStepTwoState, jobSeekerSecRef} from './types';
import {STRINGS} from 'src/locales/english';
import Spacers from '@components/atoms/Spacers';
import UploadDocView from '@components/organisms/uploadPopup';
import {userDetailsStep2Schema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';

const JobSeekerDetailsStepsTwo = forwardRef<{}, jobSeekerSecRef>(
  (props, ref) => {
    const [state, setState] = useReducer(
      (
        prev: jobSeekerDetailsStepTwoState,
        next: jobSeekerDetailsStepTwoState,
      ) => {
        return {
          ...prev,
          ...next,
        };
      },
      {
        backAccountNumber: '',
        institutionNumber: '',
        transitNumber: '',
        cheque: null,
        sinNumber: '',
        sinDocument: null,
        bankAccountNumberError: '',
        institutionNumberError: '',
        transitNumberError: '',
        chequeError: '',
        sinNumberError: '',
        sinDocumentError: '',
      },
    );

    const accountNumberRef = useRef<TextInput>(null);
    const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
    const institutionNumberRef = useRef<TextInput>(null);
    const transitNumberRef = useRef<TextInput>(null);
    const sinNumberRef = useRef<TextInput>(null);

    useImperativeHandle(ref, () => ({
      validate: validate,
    }));

    const validate = async () => {
      try {
        const fields = await userDetailsStep2Schema.validate(state, {
          abortEarly: false,
        });
        if (fields) {
          return {
            fields: {
              bankAcNo: fields.backAccountNumber,
              institutionNumber: fields.institutionNumber,
              trasitNumber: fields.transitNumber,
              sinNo: fields.sinNumber,
            },
            documents: [
              {
                name: STRINGS.cheque,
                Document: fields.cheque,
              },
              {
                name: STRINGS.sinDocument,
                Document: fields.sinDocument,
              },
            ],
            isValid: true,
          };
        }
      } catch (error) {
        const validationErrors = error as ValidationError;

        if (validationErrors.inner[0].path === 'backAccountNumber') {
          setState({
            ...state,
            bankAccountNumberError: validationErrors.inner[0].message,
          });
          accountNumberRef.current?.focus();
          scrollViewRef.current?.scrollToFocusedInput(
            findNodeHandle(accountNumberRef.current) as number,
            0,
            0,
          );
        } else if (validationErrors.inner[0].path === 'institutionNumber') {
          setState({
            ...state,
            institutionNumberError: validationErrors.inner[0].message,
          });
          institutionNumberRef.current?.focus();
          scrollViewRef.current?.scrollToFocusedInput(
            findNodeHandle(institutionNumberRef.current) as number,
            0,
            0,
          );
        } else if (validationErrors.inner[0].path === 'transitNumber') {
          setState({
            ...state,
            transitNumberError: validationErrors.inner[0].message,
          });
          transitNumberRef.current?.focus();
          scrollViewRef.current?.scrollToFocusedInput(
            findNodeHandle(transitNumberRef.current) as number,
            0,
            0,
          );
        } else if (validationErrors.inner[0].path === 'cheque') {
          setState({
            ...state,
            chequeError: validationErrors.inner[0].message,
          });
        } else if (validationErrors.inner[0].path === 'sinNumber') {
          setState({
            ...state,
            sinNumberError: validationErrors.inner[0].message,
          });
          sinNumberRef.current?.focus();
          scrollViewRef.current?.scrollToFocusedInput(
            findNodeHandle(sinNumberRef.current) as number,
            0,
            0,
          );
        } else if (validationErrors.inner[0].path === 'sinDocument') {
          setState({
            ...state,
            sinDocumentError: validationErrors.inner[0].message,
          });
          scrollViewRef.current?.scrollToEnd();
        }
        return {
          fields: null,
          isValid: false,
        };
      }
    };

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          ref={scrollViewRef}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="always">
          <CustomTextInput
            title={STRINGS.backAccountNumber}
            value={state.backAccountNumber}
            ref={accountNumberRef}
            keyboardType="number-pad"
            maxLength={12}
            onChangeText={text =>
              setState({
                ...state,
                backAccountNumber: text,
                bankAccountNumberError: '',
              })
            }
            errorMessage={state.bankAccountNumberError}
          />
          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            title={STRINGS.institutionNumber}
            ref={institutionNumberRef}
            value={state.institutionNumber}
            keyboardType="number-pad"
            maxLength={3}
            onChangeText={text =>
              setState({
                ...state,
                institutionNumber: text,
                institutionNumberError: '',
              })
            }
            errorMessage={state.institutionNumberError}
          />
          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            title={STRINGS.transitNumber}
            ref={transitNumberRef}
            value={state.transitNumber}
            keyboardType="number-pad"
            maxLength={5}
            onChangeText={text =>
              setState({
                ...state,
                transitNumber: text,
                transitNumberError: '',
              })
            }
            errorMessage={state.transitNumberError}
          />
          <Spacers type={'vertical'} size={16} />
          <UploadDocView
            title={STRINGS.cheque}
            error={state.chequeError}
            getSelectedDocumentIds={url =>
              setState({...state, cheque: url[0], chequeError: ''})
            }
          />
          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            title={STRINGS.sinNumber}
            ref={sinNumberRef}
            value={state.sinNumber}
            keyboardType="number-pad"
            maxLength={9}
            onChangeText={text =>
              setState({
                ...state,
                sinNumber: text,
                sinNumberError: '',
              })
            }
            errorMessage={state.sinNumberError}
          />
          <Spacers type={'vertical'} size={16} />
          <UploadDocView
            title={STRINGS.sinDocument}
            error={state.sinDocumentError}
            getSelectedDocumentIds={url => {
              setState({...state, sinDocument: url[0], sinDocumentError: ''});
            }}
          />
          <Spacers type={'vertical'} size={48} />
        </KeyboardAwareScrollView>
      </View>
    );
  },
);

export default JobSeekerDetailsStepsTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
