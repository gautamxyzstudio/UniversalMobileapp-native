import {StyleSheet, View} from 'react-native';
import React, {useMemo} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import FaqCard from '@components/molecules/FaqCard';

const FaqBottomSheet = React.forwardRef<BottomSheetModal>(({}, ref) => {
  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };
  const modalHeight = verticalScale(390);
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);
  return (
    <BaseBottomSheet
      ref={ref}
      headerTitle={STRINGS.fAQs}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <BottomSheetScrollView>
          <FaqCard />
        </BottomSheetScrollView>
      </View>
    </BaseBottomSheet>
  );
});

export default FaqBottomSheet;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: verticalScale(24),
    paddingTop: verticalScale(24),
  },
});
