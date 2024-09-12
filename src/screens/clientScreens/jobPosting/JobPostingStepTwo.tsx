import {StyleSheet, View} from 'react-native';
import React, {useImperativeHandle, useMemo, useReducer} from 'react';
import DatePickerInput from '@components/molecules/datepickerInput';
import {Row} from '@components/atoms/Row';
import {STRINGS} from 'src/locales/english';
import Spacers from '@components/atoms/Spacers';
import CustomTextInput from '@components/atoms/customtextInput';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CLOCK_SEC} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {
  getMinimumDateJobPost,
  IJobPostingStepTwoFields,
  IJobPostRef,
  IJobPostStepTwoRef,
} from './types';
import {jobPostStep2Schema} from '@utils/validationSchemas';
import {ValidationError} from 'yup';
import {usePatchADraftMutation} from '@api/features/client/clientApi';

type IJobPostingStepTwoState = {
  eventDate: Date | null;
  shiftStartTime: Date | null;
  shiftEndTime: Date | null;
  location: string;
  address: string;
  city: string;
  postalCode: string;
  shiftEndTimeError: string;
  shiftStartTimeError: string;
  eventDateError: string;
  locationError: string;
  addressError: string;
  cityError: string;
  postalCodeError: string;
};

const JobPostingStepTwo = React.forwardRef<any, IJobPostStepTwoRef>(
  ({}, ref) => {
    const [state, setState] = useReducer(
      (prev: IJobPostingStepTwoState, next: IJobPostingStepTwoState) => {
        return {
          ...prev,
          ...next,
        };
      },
      {
        eventDate: null,
        shiftStartTime: null,
        shiftEndTime: null,
        location: '',
        address: '',
        city: '',
        postalCode: '',
        eventDateError: '',
        shiftStartTimeError: '',
        shiftEndTimeError: '',
        locationError: '',
        addressError: '',
        cityError: '',
        postalCodeError: '',
      },
    );
    const isTimeDisabled = useMemo(() => !state.eventDate, [state.eventDate]);
    const handleValueChange = (key: string, value: any) => {
      setState({
        ...state,
        [key]: value,
        [`${key}Error`]: '',
      });
    };

    useImperativeHandle(ref, () => ({
      validate: validate,
      setData: setData,
    }));

    const setData = (data: IJobPostingStepTwoFields) => {
      setState({
        ...state,
        eventDate: new Date(data.eventDate),
        shiftStartTime: new Date(data.startShift),
        shiftEndTime: new Date(data.endShift),
        location: data.location,
        address: data.address,
        city: data.city,
        postalCode: data.postalCode,
      });
    };

    const validate = async (): Promise<{
      fields: IJobPostingStepTwoFields | null;
      isValid: boolean;
    }> => {
      try {
        const fields = await jobPostStep2Schema.validate(state, {
          abortEarly: false,
        });
        if (fields) {
          return {
            fields: {
              eventDate: fields.eventDate,
              startShift: fields.shiftStartTime,
              endShift: fields.shiftEndTime,
              location: fields.location,
              address: fields.address,
              city: fields.city,
              postalCode: fields.postalCode,
            },
            isValid: true,
          };
        }
        return {fields: null, isValid: false};
      } catch (error) {
        const validationErrors = error as ValidationError;
        if (validationErrors.inner) {
          validationErrors.inner.forEach((err: any) => {
            const field = err.path as keyof IJobPostingStepTwoFields;
            const errorMessage = err.message;
            console.log(field, errorMessage);
            setState({
              ...state,
              [`${field}Error`]: errorMessage,
            });
          });
        }

        return {fields: null, isValid: false};
      }
    };

    return (
      <View style={styles.container}>
        <KeyboardAwareScrollView
          enableOnAndroid
          contentContainerStyle={styles.containerSec}
          showsVerticalScrollIndicator={false}
          extraHeight={verticalScale(200)}
          keyboardShouldPersistTaps="always">
          <Row spaceBetween style={styles.row}>
            <DatePickerInput
              title={STRINGS.eventDate}
              currentDate={state.eventDate}
              minimumDate={getMinimumDateJobPost(1)}
              getSelectedDate={(date: Date) =>
                handleValueChange(Object.keys(state)[0], date)
              }
              errorMessage={state.eventDateError}
            />
          </Row>
          <Spacers type={'vertical'} size={16} />
          <Row
            pointerEvents={isTimeDisabled ? 'none' : 'auto'}
            spaceBetween
            style={[styles.row, isTimeDisabled && styles.opacity]}>
            <DatePickerInput
              title={STRINGS.start_time}
              mode="time"
              outerContainer={styles.timerInput}
              right={
                <CLOCK_SEC
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              }
              errorMessage={state.shiftStartTimeError}
              currentDate={state.shiftStartTime}
              getSelectedDate={(date: Date) =>
                handleValueChange(Object.keys(state)[1], date)
              }
            />

            <DatePickerInput
              title={STRINGS.end_time}
              mode="time"
              outerContainer={styles.timerInput}
              right={
                <CLOCK_SEC
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              }
              errorMessage={state.shiftEndTimeError}
              currentDate={state.shiftEndTime}
              getSelectedDate={(date: Date) =>
                handleValueChange(Object.keys(state)[2], date)
              }
            />
          </Row>

          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            title={STRINGS.location}
            value={state.location}
            onTextChange={text =>
              handleValueChange(Object.keys(state)[3], text)
            }
            errorMessage={state.locationError}
          />
          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            value={state.address}
            title={STRINGS.address}
            onTextChange={e => handleValueChange(Object.keys(state)[4], e)}
            errorMessage={state.addressError}
          />
          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            value={state.city}
            onTextChange={e => handleValueChange(Object.keys(state)[5], e)}
            title={STRINGS.city}
            errorMessage={state.cityError}
          />
          <Spacers type={'vertical'} size={16} />
          <CustomTextInput
            keyboardType="number-pad"
            title={STRINGS.postal_code}
            onTextChange={e => handleValueChange(Object.keys(state)[6], e)}
            value={state.postalCode}
            errorMessage={state.postalCodeError}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  },
);

export default JobPostingStepTwo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    width: '100%',
  },
  timerInput: {
    width: '48%',
  },
  containerSec: {
    flexGrow: 1,
  },
  opacity: {
    opacity: 0.5,
  },
});
