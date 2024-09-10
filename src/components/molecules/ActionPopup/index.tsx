import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomModal from '../customModal';
import {fonts} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import {SvgProps} from 'react-native-svg';
import Spacers from '@components/atoms/Spacers';
import CustomButton from '../customButton';
import {getPopupButtonStylesFromType} from './types';
import {useTheme} from '@theme/Theme.context';
import {customModalRef} from '../customModal/types';
import {verticalScale} from '@utils/metrics';

type IActionPopup = {
  title?: string;
  icon?: React.FC<SvgProps>;
  withButton?: boolean;
  buttonPressHandler?: () => void;
  buttonTitle?: string;
  type: 'delete' | 'error' | 'success';
};

const ActionPopup = React.forwardRef<customModalRef, IActionPopup>(
  (
    {withButton = true, buttonTitle, buttonPressHandler, type, title, icon},
    ref,
  ) => {
    const styles = useThemeAwareObject(getStyles);
    const Icon = icon;
    const {theme} = useTheme();
    const buttonStyles = getPopupButtonStylesFromType(type, theme);
    return (
      <CustomModal hideOnClickOutSide={true} ref={ref}>
        <View style={styles.popupView}>
          {Icon && (
            <Icon width={verticalScale(40)} height={verticalScale(40)} />
          )}
          <Spacers type="vertical" size={verticalScale(24)} />
          {title && <Text style={styles.title}>{title}</Text>}
          <Spacers type="vertical" size={verticalScale(24)} />
          {withButton && (
            <CustomButton
              title={buttonTitle}
              buttonStyle={[styles.buttonStyle, buttonStyles.containerStyles]}
              titleStyles={[styles.titleStyles, buttonStyles.titleStyles]}
              disabled={false}
              onButtonPress={buttonPressHandler}
            />
          )}
        </View>
      </CustomModal>
    );
  },
);

export default ActionPopup;

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    animation: {
      width: verticalScale(56),
      height: verticalScale(56),
      alignSelf: 'center',
    },
    title: {
      alignSelf: 'center',
      ...fonts.medium,
      textAlign: 'center',
      color: colors.color.black,
    },
    description: {
      alignSelf: 'center',
      ...fonts.regular,
      color: colors.color.disabled,
      marginTop: verticalScale(8),
    },
    popupView: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonStyle: {
      height: verticalScale(36),
      paddingVertical: 0,
      paddingHorizontal: verticalScale(34),
      backgroundColor: colors.color.primary,
      borderWidth: 1,
    },
    titleStyles: {
      color: colors.color.red,
    },
  });
  return styles;
};
