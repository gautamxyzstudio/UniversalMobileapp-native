import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import DatePicker from 'react-native-date-picker';
import BottomButtonView from '@components/organisms/bottomButtonView';
import {STRINGS} from 'src/locales/english';

type ICheckinCheckoutBottomSheetProps = {
  type: 'checkin' | 'checkout';
  onPressButton: (date: Date, type: 'checkin' | 'checkout') => void;
};

const CheckinCheckoutBottomSheet = React.forwardRef<
  BottomSheetModal,
  ICheckinCheckoutBottomSheetProps
>(({type, onPressButton}, ref) => {
  const snapPoints = [0.1, 400];
  const [date, setDate] = useState<Date>(new Date());
  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };

  const onPressConfirm = () => {
    onClose;
    onPressButton(date, 'checkin');
  };

  return (
    <BaseBottomSheet
      headerTitle={type === 'checkin' ? 'CheckIn' : 'Checkout'}
      ref={ref}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <DatePicker date={new Date()} onDateChange={setDate} mode={'time'} />
      </View>
      <BottomButtonView
        disabled={false}
        secondaryButtonTitles={STRINGS.cancel}
        title={STRINGS.check_in}
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
