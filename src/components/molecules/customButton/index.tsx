import {Text, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import RippleButton from '@components/atoms/rippleEffect';
import {useTheme} from '@theme/Theme.context';
import * as TapHaptic from '@utils/haptic';
import {TapHapticFeedbackTypes} from '@utils/haptic';
import {ICustomButtonProps} from './types';
import {verticalScale} from '@utils/metrics';
import {ActivityIndicator} from 'react-native-paper';

const CustomButton: React.FC<ICustomButtonProps> = ({
  title,
  backgroundColor,
  onButtonPress,
  loaderColor,
  disabled,
  type,
  rippleColor,
  isLoading,
  titleStyles,
  buttonStyle,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();

  const onPressButton = () => {
    TapHaptic.tapHaptic(TapHapticFeedbackTypes.impactLight);
    onButtonPress && onButtonPress();
  };

  return (
    <RippleButton
      disabled={isLoading ?? disabled}
      rippleColor={rippleColor ? rippleColor : 'transparent'}
      rippleActionHandler={onPressButton}>
      <View
        style={[
          styles.button,
          {backgroundColor: backgroundColor ?? theme.color.darkBlue},
          disabled && {backgroundColor: theme.color.disabled},
          type === 'outline' && {
            backgroundColor: theme.color.primary,
            borderWidth: 1,
            borderColor: theme.color.darkBlue,
            height: verticalScale(48),
          },
          buttonStyle,
        ]}>
        {isLoading ? (
          <ActivityIndicator
            color={loaderColor ?? theme.color.primary}
            size={'small'}
          />
        ) : (
          <Text
            style={[
              styles.next,
              type === 'outline' && {color: theme.color.darkBlue},
              titleStyles,
            ]}>
            {title}
          </Text>
        )}
      </View>
    </RippleButton>
  );
};

export default CustomButton;
