import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import React, {LegacyRef, useState} from 'react';
import {CALENDAR} from '@assets/exporter';
import CustomTextInput from '@components/atoms/customtextInput';
import {STRINGS} from 'src/locales/english';
import DatePicker from 'react-native-date-picker';
import {convertDateToDobFormat, extractTimeFromDate} from '@utils/constants';
import {verticalScale} from '@utils/metrics';

type IDatePickerInputPropTypes = {
  currentDate?: Date | null;
  minimumDate?: Date;
  outerContainer?: StyleProp<ViewStyle>;
  maximumDate?: Date;
  title?: string;
  right?: React.ReactNode;
  mode?: 'date' | 'time' | 'datetime' | undefined;
  errorMessage?: string;
  getSelectedDate: (date: Date) => void;
  compRef?: LegacyRef<TextInput>;
};

const DatePickerInput: React.FC<IDatePickerInputPropTypes> = ({
  currentDate,
  maximumDate,
  mode = 'date',
  outerContainer,
  title,
  right,
  minimumDate,
  compRef,
  getSelectedDate,
  errorMessage,
}) => {
  const [date, setDate] = useState({
    displayDate: getDisplayDate(currentDate ?? null, mode),
    actualDate: currentDate,
  });

  const [open, setOpen] = useState(false);

  const onDateConfirm = (selectedDate: Date) => {
    setOpen(false);
    setDate({
      displayDate: getDisplayDate(selectedDate, mode),
      actualDate: selectedDate,
    });
    getSelectedDate(selectedDate);
  };

  const onCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <View style={outerContainer}>
        <Pressable onPress={() => setOpen(true)} style={styles.view} />
        <CustomTextInput
          title={title ?? STRINGS.date_of_birth}
          ref={compRef}
          right={
            <View style={styles.calendar}>
              {right ?? (
                <CALENDAR
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              )}
            </View>
          }
          value={date.displayDate ?? ''}
          errorMessage={errorMessage}
        />
      </View>
      <DatePicker
        modal
        open={open}
        date={date.actualDate ?? new Date()}
        mode={mode ?? 'date'}
        maximumDate={maximumDate ?? undefined}
        minimumDate={minimumDate ?? undefined}
        onConfirm={onDateConfirm}
        onCancel={onCancel}
      />
    </>
  );
};

export default DatePickerInput;

const styles = StyleSheet.create({
  view: {
    position: 'absolute',
    backgroundColor: 'transparent',
    zIndex: 1,
    height: '100%',
    width: '100%',
  },
  calendar: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: verticalScale(16),
  },
});

const getDisplayDate = (
  date: Date | null,
  mode: 'date' | 'time' | 'datetime' | undefined,
) => {
  if (mode === 'date') {
    return convertDateToDobFormat(date ?? null); //
  } else if (mode === 'time') {
    return extractTimeFromDate(date);
  }
};
