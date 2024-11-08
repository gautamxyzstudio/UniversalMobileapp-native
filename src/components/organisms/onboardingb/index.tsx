import {Pressable, Text, TouchableOpacity, View} from 'react-native';
import React, {useMemo} from 'react';
import {LinearGradient} from 'react-native-linear-gradient';
import {IOnboardingProps} from './types';

import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {useNavigation} from '@react-navigation/native';
import {touchSlope} from 'src/constants/constants';
import {verticalScale, windowWidth} from '@utils/metrics';
import {useScreenInsets} from 'src/hooks/useScreenInsets';
import {Row} from '@components/atoms/Row';

import {TextInput} from 'react-native-paper';
import {ARROW_HEADER, ICONS} from '@assets/exporter';
import {useTheme} from '@theme/Theme.context';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

const OnBoardingBackground: React.FC<IOnboardingProps> = ({
  children,
  title,
  searchValue,
  onChangeSearchValue,
  onPressSearchCross,
  subTitle,
  isInlineTitle,
  rightIcon,
  rightIconPressHandler,
  displayRightIcon,
  childrenStyles,
  isSearch,
  hideBack,
}) => {
  const {insetsTop, insetsBottom} = useScreenInsets();

  const styles = useThemeAwareObject(getStyles);
  const {theme} = useTheme();
  const navigation = useNavigation();
  const searchAnimatedValue = useSharedValue(0);

  const onPressBack = () => {
    navigation.goBack();
  };

  const SecondIcon = useMemo(() => rightIcon, [rightIcon]);

  const headerAnimatedStyles = useAnimatedStyle(() => {
    return {
      opacity: interpolate(searchAnimatedValue.value, [0, 1], [1, 0]),
    };
  });

  const searchInputAnimatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: interpolate(
            searchAnimatedValue.value,
            [0, 1],
            [windowWidth, 0],
          ),
        },
      ],
    };
  });

  const onPressRightIcon = () => {
    if (isSearch) {
      searchAnimatedValue.value = withTiming(1);
    } else {
      rightIconPressHandler && rightIconPressHandler();
    }
  };

  const onPressBackSearch = () => {
    onPressSearchCross && onPressSearchCross();
    searchAnimatedValue.value = withSpring(0, {
      damping: 10,
    });
  };

  return (
    <LinearGradient
      style={[
        styles.container,
        {
          paddingTop: insetsTop,
        },
      ]}
      colors={['#F9751A', '#FFBB8C', '#FFF']}>
      <View style={[styles.header]}>
        <View style={styles.flexBox}>
          {!hideBack && (
            <Animated.View style={[styles.view, headerAnimatedStyles]}>
              <Row style={styles.inlineTitleContainer} alignCenter>
                <TouchableOpacity hitSlop={touchSlope} onPress={onPressBack}>
                  <ARROW_HEADER
                    width={verticalScale(24)}
                    height={verticalScale(24)}
                  />
                </TouchableOpacity>
                {isInlineTitle && <Text style={styles.title}>{title}</Text>}
              </Row>

              {displayRightIcon && SecondIcon && (
                <TouchableOpacity
                  hitSlop={touchSlope}
                  onPress={onPressRightIcon}>
                  <SecondIcon
                    width={verticalScale(24)}
                    height={verticalScale(24)}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          )}
          <Animated.View
            style={[styles.animatedView, searchInputAnimatedStyles]}>
            <Row alignCenter style={styles.searchRow}>
              <Pressable onPress={onPressBackSearch}>
                <ARROW_HEADER />
              </Pressable>
              <TextInput
                style={styles.input}
                left={<TextInput.Icon color={'#000'} icon={ICONS.search} />}
                right={
                  searchValue && (
                    <TextInput.Icon
                      onPress={onPressSearchCross}
                      color={'#000'}
                      icon={ICONS.searchCross}
                    />
                  )
                }
                mode="flat"
                value={searchValue}
                onChangeText={onChangeSearchValue}
                cursorColor="#000"
                underlineColor="#FFC094"
                activeUnderlineColor="#FFC094"
                placeholder="Search for Candidates..."
                placeholderTextColor={theme.color.black}
                contentStyle={styles.inputText}
              />
            </Row>
          </Animated.View>
        </View>

        <>
          {title && !isInlineTitle && (
            <View style={styles.titleContainer}>
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
            </View>
          )}
          {subTitle && <Text style={styles.subTitle}>{subTitle}</Text>}
        </>
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
