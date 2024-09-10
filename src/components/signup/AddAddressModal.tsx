import {StyleSheet, Text, View} from 'react-native';
import React, {LegacyRef, useMemo} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import CustomTextInput from '@components/atoms/customtextInput';

type IAddAddressModalProps = {
  compRef: LegacyRef<BottomSheetMethods>;
};

const AddAddressModal: React.FC<IAddAddressModalProps> = ({compRef}) => {
  const modalHeight = verticalScale(340);
  const snapPoints = useMemo(() => [0.01, modalHeight], []);
  const styles = useThemeAwareObject(createStyles);
  const onClose = () => {
    // @ts-ignore
    compRef.current?.snapToIndex(0);
  };

  return (
    <BaseBottomSheet snapPoints={snapPoints} ref={compRef} onClose={onClose}>
      <View>
        <View style={styles.header}>
          <Text style={styles.title}>{STRINGS.add_address}</Text>
        </View>
        <View style={styles.inputContainer}>
          <CustomTextInput title={'Flat/ House no.'} errorMessage={''} />
          <View style={styles.spacer} />
          <CustomTextInput title={'Area/ Sector/ Locality'} errorMessage={''} />
        </View>
      </View>
    </BaseBottomSheet>
  );
};

export default AddAddressModal;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    header: {
      marginTop: verticalScale(10),
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: color.grey,
      width: '120%',
      alignSelf: 'center',
      paddingVertical: verticalScale(14),
    },
    title: {
      ...fonts.headingSmall,
    },
    inputContainer: {
      marginTop: verticalScale(40),
    },
    spacer: {
      height: verticalScale(16),
    },
  });
  return styles;
};
