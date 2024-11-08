import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {STRINGS} from 'src/locales/english';

type ICheckinCheckoutBottomSheetProps = {
  type: 'checkIn' | 'checkOut';
  onPressButton: (date: Date, type: 'checkIn' | 'checkOut') => void;
};

const CheckinCheckoutBottomSheet = React.forwardRef<
  BottomSheetModal,
  ICheckinCheckoutBottomSheetProps
>(({type, onPressButton}, ref) => {
  const snapPoints = [0.1, 400];
  const [currentDate, setDate] = useState<Date>(new Date());
  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };

  const onPressConfirm = () => {
    onClose();
    setTimeout(() => {
      onPressButton(currentDate, type);
      setDate(new Date());
    }, 200);
  };

  return (
    <BaseBottomSheet
      headerTitle={type === 'checkIn' ? 'CheckIn' : 'Checkout'}
      ref={ref}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <DatePicker
          date={currentDate}
          onDateChange={d => setDate(d)}
          mode={'time'}
        />
      </View>
      <BottomButtonView
        disabled={false}
        secondaryButtonTitles={STRINGS.cancel}
        title={type === 'checkIn' ? STRINGS.check_in : STRINGS.check_out}
        isMultiple
        onPressSecondaryButton={onClose}
        onButtonPress={onPressConfirm}
      />
    </BaseBottomSheet>
  );
});

export default CheckinCheckoutBottomSheet;

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});
