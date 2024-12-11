/* eslint-disable react-hooks/exhaustive-deps */
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef} from 'react';
import {ICustomTextInputProps} from './types';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fontFamily, fonts} from '@utils/common.styles';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {moderateScale, verticalScale, windowWidth} from '@utils/metrics';
import {useTheme} from '@theme/Theme.context';
import InputAccessoryViewComp from '@components/molecules/inputAccesoryView';

const CustomTextInput = React.forwardRef<TextInput, ICustomTextInputProps>(
  (
    {
      left,
      right,
      labelContainerStyles,
      textCustomColor,
      value,
      disableAccessoryView,
      outerContainerStyles,
      title,
      isMultiline,
      secureTextEntry,
      errorMessage,
      innerContainerStyles,
      hideTitle,
      onTextChange,
      textInputStyles,
      editable = true,
      ...textInputProps
    },
    ref,
  ) => {
    const styles = useThemeAwareObject(getStyles);
    const textInputRef = useRef<TextInput | null>(null);
    const textAnimation = useSharedValue(1);
    const theme = useTheme();
    const translationWidth = moderateScale(20);
    const animationStartValue = Platform.OS === 'ios' ? 0 : verticalScale(4);
    const height =
      Platform.OS === 'ios'
        ? verticalScale(60 / 2 + moderateScale(windowWidth > 400 ? 6 : 9))
        : verticalScale(54 / 2 + moderateScale(windowWidth > 400 ? 6 : 9));

    const labelAnimation = useAnimatedStyle(() => {
      return {
        transform: [
          {
            scale: textAnimation.value,
          },
          {
            translateY: interpolate(
              textAnimation.value,
              [1, 0.7],
              [animationStartValue, -height],
            ),
          },
          {
            translateX: interpolate(
              textAnimation.value,
              [1, 0.7],
              [0, -translationWidth],
            ),
          },
        ],
        paddingHorizontal: interpolate(textAnimation.value, [1, 0.7], [0, 10]),
      };
    });

    useEffect(() => {
      if (value) {
        setTimeout(() => {
          textAnimation.value = withTiming(0.7);
        }, 1);
      }
    }, [value]);

    const onFocusBlur = () => {
      if (value === '' || value === undefined) {
        textAnimation.value = withTiming(1);
        textInputRef.current?.blur();
      }
    };

    const onInputFocus = () => {
      textAnimation.value = withTiming(0.7);
      textInputRef.current?.focus();
    };

    return (
      <View>
        <Pressable
          onPress={() => textInputRef.current?.focus()}
          style={[
            styles.outerMain,
            isMultiline && {height: verticalScale(119)},
            outerContainerStyles,
          ]}>
          <View
            style={[
              styles.container,
              errorMessage ? {borderColor: theme.theme.color.red} : null,
              isMultiline && {height: verticalScale(115)},
              innerContainerStyles,
            ]}>
            {left}
            <View style={styles.inputMain}>
              {!hideTitle && (
                <Animated.View
                  style={[
                    styles.labelContainer,
                    isMultiline && {top: verticalScale(33) / 2},
                    labelContainerStyles,
                    labelAnimation,
                  ]}>
                  <Text
                    style={[
                      styles.label,
                      errorMessage ? {color: theme.theme.color.red} : null,
                    ]}>
                    {title}
                  </Text>
                </Animated.View>
              )}
              <TextInput
                ref={ref || textInputRef}
                onBlur={onFocusBlur}
                onFocus={onInputFocus}
                inputAccessoryViewID={'ID' + title}
                textAlignVertical="top"
                cursorColor={theme.theme.color.darkBlue}
                secureTextEntry={secureTextEntry}
                editable={editable}
                style={[
                  styles.textInput,
                  isMultiline && {
                    height: verticalScale(100),
                    marginTop: verticalScale(12),
                  },
                  {
                    color: textCustomColor
                      ? textCustomColor
                      : editable
                      ? theme.theme.color.textPrimary
                      : theme.theme.color.disabled,
                  },
                  textInputStyles,
                ]}
                onChangeText={onTextChange}
                value={value}
                {...textInputProps}
              />
            </View>
            {right}
          </View>
        </Pressable>
        {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
        {!disableAccessoryView && Platform.OS === 'ios' && (
          <InputAccessoryViewComp title={title} />
        )}
      </View>
    );
  },
);

export default CustomTextInput;

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    outerMain: {
      height: verticalScale(65),
      justifyContent: 'center',
      position: 'relative',
    },
    container: {
      borderWidth: 1,

      flexDirection: 'row',
      borderRadius: 8,
      justifyContent: 'center',
      borderColor: theme.color.grey,
      height: verticalScale(56),
    },
    errorText: {
      fontSize: moderateScale(12),
      color: theme.color.red,
      fontFamily: fontFamily.regular,
      marginTop: Platform.OS === 'android' ? -4 : -1,
    },
    labelContainer: {
      flexDirection: 'row',
      position: 'absolute',
      marginLeft: verticalScale(16),
      backgroundColor: theme.color.primary,
      textAlign: 'center',
      pointerEvents: 'none',
    },
    inputMain: {
      flex: 1,
      justifyContent: 'center',
      textAlignVertical: 'center',
    },
    textInput: {
      paddingHorizontal: verticalScale(16),
      // paddingVertical: verticalScale(16),
      paddingTop: 0,
      paddingBottom: 0,
      color: theme.color.textPrimary,
      ...fonts.medium,
      ...Platform.select({
        ios: {
          lineHeight: moderateScale(20),
        },
        android: {
          lineHeight: undefined,
        },
      }),
    },
    label: {
      color: theme.color.disabled,
      // paddingTop: verticalScale(3),
      height: Platform.OS === 'android' ? verticalScale(23) : verticalScale(20),
      zIndex: 999,
      ...fonts.medium,
    },
    inputAccessoryContainerView: {
      height: '100%',
      flexDirection: 'row',

      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    accessoryPlaceholderText: {
      marginLeft: 16,
      color: theme.color.textPrimary,
      ...fonts.regular,
    },
    accessoryDoneButton: {
      height: '70%',
      marginRight: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    doneText: {
      color: '#121212',
      ...fonts.regular,
    },
    inputAccessoryContainerOuter: {
      height: 50,
      width: '100%',
    },
  });
  return styles;
};
