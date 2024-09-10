import {StyleSheet, View} from 'react-native';
import React from 'react';
import CustomButton from '@components/molecules/customButton';
import {IButtonButtonView} from './types';
import {horizontalScale, verticalScale, windowWidth} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Row} from '@components/atoms/Row';

const BottomButtonView: React.FC<IButtonButtonView> = ({
  title,
  backgroundColor,
  onButtonPress,
  isMultiple,
  isLoading,
  disabled,
  onPressSecondaryButton,
  secondaryButtonTitles,
  buttonType,
  rippleColor,
}) => {
  const styles = useThemeAwareObject(getStyles);

  return (
    <View>
      <Row alignCenter style={[styles.mainView]}>
        {isMultiple && (
          <CustomButton
            disabled={disabled}
            type="outline"
            onButtonPress={onPressSecondaryButton}
            buttonStyle={styles.button}
            rippleColor={rippleColor}
            title={secondaryButtonTitles}
            backgroundColor={backgroundColor}
          />
        )}
        <CustomButton
          disabled={disabled}
          onButtonPress={onButtonPress}
          isLoading={isLoading}
          buttonStyle={[isMultiple ? styles.button : {width: windowWidth - 48}]}
          rippleColor={rippleColor}
          type={buttonType}
          title={title}
          backgroundColor={backgroundColor}
        />
      </Row>
    </View>
  );
};

export default BottomButtonView;

const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    mainView: {
      width: windowWidth,
      paddingHorizontal: verticalScale(24),
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      gap: verticalScale(16),
      paddingTop: verticalScale(16),
      borderTopWidth: 1,
      borderTopColor: colors.color.grey,
    },
    button: {
      width: horizontalScale(164),
    },
  });
  return styles;
};
