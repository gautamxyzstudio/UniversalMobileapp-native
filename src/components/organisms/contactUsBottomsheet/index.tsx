import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {moderateScale, verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';

const ContactUsBottomSheet = React.forwardRef<BottomSheetModal>(({}, ref) => {
  const styles = useThemeAwareObject(createStyes);
  const modalHeight = verticalScale(186);
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);

  console.log(modalHeight);

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
  };
  return (
    <BaseBottomSheet
      ref={ref}
      headerTitle={STRINGS.contact}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <Text style={styles.heading}>{STRINGS.email}</Text>
        <Text style={styles.subheading}>{'xyz@thexyzstudio.com'}</Text>
      </View>
    </BaseBottomSheet>
  );
});

export default ContactUsBottomSheet;
const createStyes = (theme: Theme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: verticalScale(24),
      paddingTop: verticalScale(24),
      gap: verticalScale(8),
    },
    heading: {
      ...fonts.regular,
      color: theme.color.disabled,
      lineHeight: moderateScale(18),
    },
    subheading: {
      ...fonts.regular,
      color: theme.color.textPrimary,
      lineHeight: moderateScale(20),
    },
  });
