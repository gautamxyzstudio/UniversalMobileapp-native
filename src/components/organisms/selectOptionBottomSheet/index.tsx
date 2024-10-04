import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {SvgProps} from 'react-native-svg';
import SelectOptionCard from '@components/molecules/selectOptionCard';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';

type IOption = {
  icon: React.FC<SvgProps>;
  title: string;
  onPress: () => void;
  isDisabled?: boolean;
};

type ISelectOptionBottomSheetProps = {
  modalHeight: number;
  headerTitle?: string;
  customStyles?: StyleProp<ViewStyle>;
  options: IOption[];
};

const SelectOptionBottomSheet = React.forwardRef<
  BottomSheetModal,
  ISelectOptionBottomSheetProps
>(({modalHeight, options, headerTitle, customStyles}, ref) => {
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };

  return (
    <BaseBottomSheet
      ref={ref}
      headerTitle={headerTitle}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={[styles.container, customStyles]}>
        {options.map(({icon, title, onPress, isDisabled}, index) => (
          <SelectOptionCard
            key={index}
            isDisabled={isDisabled}
            title={title}
            icon={icon}
            onPress={onPress}
          />
        ))}
      </View>
    </BaseBottomSheet>
  );
});

export default SelectOptionBottomSheet;

const styles = StyleSheet.create({
  container: {
    gap: verticalScale(16),
  },
});
