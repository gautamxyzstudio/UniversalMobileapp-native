import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {BaseBottomSheet} from '../bottomsheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import CustomTextInput from '@components/atoms/customtextInput';
import Spacers from '@components/atoms/Spacers';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import CustomButton from '../customButton';
import {Row} from '@components/atoms/Row';

const GetHelpBottomSheet = React.forwardRef<BottomSheetModal, any>(
  ({}, ref) => {
    const modalHeight = verticalScale(336);
    const styles = useThemeAwareObject(createStyles);
    const keyboardHeight = useKeyboardHeight();
    const snapPoints = useMemo(
      () => [0.01, modalHeight, modalHeight + keyboardHeight],
      [modalHeight, keyboardHeight],
    );

    const onClose = () => {
      // @ts-ignore
      ref.current?.snapToIndex(0);
    };

    const onFocus = () => {
      // @ts-ignore
      ref.current.snapToIndex(2);
    };

    return (
      <BaseBottomSheet snapPoints={snapPoints} ref={ref} onClose={onClose}>
        <View style={styles.mainView}>
          <View style={styles.container}>
            <Text style={styles.title}>{STRINGS.have_an_issue}</Text>
            <Spacers type="vertical" size={16} />
            <CustomTextInput
              placeholder={STRINGS.type_your_issue}
              title={''}
              isMultiline
              hideTitle
              onFocus={onFocus}
              numberOfLines={5}
              multiline={true}
              textAlignVertical="top"
              errorMessage={''}
            />
          </View>
          <Row spaceBetween>
            <CustomButton
              type="outline"
              buttonStyle={styles.button}
              title={STRINGS.cancel}
              disabled={false}
            />
            <CustomButton
              buttonStyle={styles.button}
              title={STRINGS.send}
              disabled={false}
            />
          </Row>
        </View>
      </BaseBottomSheet>
    );
  },
);

export default GetHelpBottomSheet;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      marginTop: verticalScale(16),
    },
    title: {
      ...fonts.mediumBold,
      color: color.textPrimary,
    },
    button: {
      width: verticalScale(164),
      height: verticalScale(48),
      paddingVertical: 0,
    },
    mainView: {flex: 1, justifyContent: 'space-between'},
  });
  return styles;
};
