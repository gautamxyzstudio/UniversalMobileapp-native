/* eslint-disable react-hooks/exhaustive-deps */
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {moderateScale, verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {useTheme} from '@theme/Theme.context';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import JobDetailsRenderer from '@components/employee/JobDetailsRenderer';

type IEditorTextInputView = {
  label: string;
  initialValue?: string;
  errorMessage: string;
  getEnteredText: (text: string) => void;
};

const EditorTextInputView: React.FC<IEditorTextInputView> = ({
  label,
  getEnteredText,
  errorMessage,
  initialValue,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const theme = useTheme();
  const textAnimation = useSharedValue(1);
  const height = verticalScale(65 / 2 + moderateScale(6));
  const [htmlContext, setHtmlContent] = useState<string>('');
  const translationWidth = moderateScale(20);
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    if (htmlContext.length > 0) {
      textAnimation.value = withTiming(0.7);
    } else {
      textAnimation.value = withTiming(1);
    }
  }, [htmlContext]);

  useEffect(() => {
    if (initialValue) {
      setHtmlContent(initialValue);
    }
  }, [initialValue]);

  const onPressInput = () => {
    navigation.navigate('textEditor', {
      initialValue: htmlContext,
      title: label,
      onGoBack: data => {
        setHtmlContent(data);
        getEnteredText(data);
      },
    });
  };

  const labelAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: textAnimation.value,
        },
        {
          translateY: interpolate(textAnimation.value, [1, 0.7], [0, -height]),
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
  return (
    <View>
      <Pressable onPress={onPressInput}>
        <View
          style={[
            styles.container,
            errorMessage ? {borderColor: theme.theme.color.red} : null,
          ]}>
          <Animated.View
            style={[
              styles.labelContainer,
              {top: verticalScale(33) / 2},
              labelAnimation,
            ]}>
            <Text
              style={[
                styles.label,
                errorMessage ? {color: theme.theme.color.red} : null,
              ]}>
              {label}
            </Text>
          </Animated.View>
          <ScrollView>
            <JobDetailsRenderer description={htmlContext} />
          </ScrollView>
        </View>
      </Pressable>
    </View>
  );
};

export default EditorTextInputView;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      borderWidth: 1,
      borderColor: theme.color.grey,
      borderRadius: 8,
      paddingHorizontal: verticalScale(16),
      height: verticalScale(164),
      paddingVertical: verticalScale(16),
    },
    label: {
      color: theme.color.disabled,
      // paddingTop: verticalScale(3),
      height: Platform.OS === 'android' ? verticalScale(23) : verticalScale(18),
      zIndex: 999,
      ...fonts.medium,
    },

    labelContainer: {
      flexDirection: 'row',
      position: 'absolute',
      marginLeft: verticalScale(16),
      backgroundColor: '#fff',
      textAlign: 'center',

      pointerEvents: 'none',
    },
    title: {
      color: theme.color.textPrimary,
      ...fonts.medium,
    },
  });
