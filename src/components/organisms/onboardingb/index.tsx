import {Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {IOnboardingProps} from './types';
import {ARROW_HEADER} from '@assets/exporter';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {touchSlope} from 'src/constants/constants';
import {verticalScale} from '@utils/metrics';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {Row} from '@components/atoms/Row';

const OnBoardingBackground: React.FC<IOnboardingProps> = ({
  children,
  title,
  subTitle,
  rightIcon,
  rightIconPressHandler,
  displayRightIcon,
  childrenStyles,
  hideBack,
}) => {
  const {insetsTop, insetsBottom} = useScreenInsets();

  const styles = useThemeAwareObject(getStyles);
  const navigation = useNavigation();

  const onPressBack = () => {
    navigation.goBack();
  };

  const SecondIcon = rightIcon;

  return (
    <LinearGradient
      style={[
        styles.container,
        {
          paddingTop: insetsTop,
        },
      ]}
      colors={['#182452', 'rgba(24, 36, 82, 0.80)', '#5F70AF']}>
      <View style={[styles.header]}>
        <View style={styles.flexBox}>
          {!hideBack && (
            <>
              <TouchableOpacity hitSlop={touchSlope} onPress={onPressBack}>
                <ARROW_HEADER
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              </TouchableOpacity>
              {displayRightIcon && SecondIcon && (
                <TouchableOpacity
                  hitSlop={touchSlope}
                  onPress={rightIconPressHandler}>
                  <SecondIcon
                    width={verticalScale(24)}
                    height={verticalScale(24)}
                  />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>

        <View style={styles.titleContainer}>
          {title && (
            <Row spaceBetween alignCenter>
              <Text style={styles.title}>{title}</Text>
              {hideBack && displayRightIcon && SecondIcon && (
                <TouchableOpacity
                  hitSlop={touchSlope}
                  onPress={rightIconPressHandler}>
                  <SecondIcon
                    width={verticalScale(24)}
                    height={verticalScale(24)}
                  />
                </TouchableOpacity>
              )}
            </Row>
          )}
          {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </View>
      </View>
      <View
        style={[
          styles.mainView,
          {paddingBottom: insetsBottom},
          childrenStyles,
        ]}>
        {children}
      </View>
    </LinearGradient>
  );
};

export default OnBoardingBackground;
