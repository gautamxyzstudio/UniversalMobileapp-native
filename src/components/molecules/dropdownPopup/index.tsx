/* eslint-disable react-hooks/exhaustive-deps */
import {DROPDOWN_SECONDARY} from '@assets/exporter';
import {useTheme} from '@theme/Theme.context';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fontFamily, fonts} from '@utils/common.styles';
import {verticalScale, moderateScale, windowWidth} from '@utils/metrics';
import React, {useState, useCallback, LegacyRef, useEffect} from 'react';
import {View, StyleSheet, Text, Platform, TextInput} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const height = verticalScale(62 / 2 + moderateScale(windowWidth > 400 ? 6 : 9));

export type IDropDownItem = {
  label: string;
  value: string;
};

type IDropdownComponentProps = {
  title: string;
  data: IDropDownItem[];
  onChangeValue: (value: IDropDownItem) => void;
  error: string;
  dropdownPosition?: 'auto' | 'bottom' | 'top' | undefined;
  value: string;
  compRef?: LegacyRef<TextInput>;
};

const DropdownComponent: React.FC<IDropdownComponentProps> = ({
  title,
  data,
  compRef,
  onChangeValue,
  dropdownPosition,
  value,
  error,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const styles = useThemeAwareObject(getStyles);

  const textAnimation = useSharedValue(1);
  const translationWidth = moderateScale(20);
  const {theme} = useTheme();

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

  useEffect(() => {
    if (value) {
      handleOnChange({label: value, value: value});
    } else {
      textAnimation.value = withTiming(1);
    }
  }, [value]);

  const handleOnChange = useCallback(
    (item: IDropDownItem) => {
      if (textAnimation.value === 1) {
        textAnimation.value = withTiming(0.7);
      }
      setIsFocus(false);
      onChangeValue(item);
    },
    [onChangeValue, textAnimation, value],
  );

  if (!Array.isArray(data)) {
    return null;
  }

  return (
    <View key={value} style={styles.container}>
      <TextInput ref={compRef} style={{display: 'none'}} />
      <Animated.View style={[styles.labelContainer, labelAnimation]}>
        <Text
          style={[styles.labelText, error ? {color: theme.color.red} : null]}>
          {title}
        </Text>
      </Animated.View>
      <Dropdown
        key={value}
        style={[
          styles.dropdown,
          isFocus && styles.focusedContainer,
          error.length > 0 && styles.errorContainer,
        ]}
        selectedTextStyle={styles.selectedTextStyle}
        data={data}
        labelField="label"
        valueField="value"
        renderRightIcon={() => (
          <DROPDOWN_SECONDARY
            width={verticalScale(24)}
            height={verticalScale(24)}
          />
        )}
        dropdownPosition={dropdownPosition ?? 'auto'}
        maxHeight={300}
        placeholder={value}
        renderItem={item => {
          return (
            <View style={styles.item}>
              <Text style={styles.value}>{item.label}</Text>
            </View>
          );
        }}
        searchPlaceholder="Search..."
        value={value}
        onConfirmSelectItem={handleOnChange}
        onChange={handleOnChange}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

export default DropdownComponent;

const getStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      justifyContent: 'center',

      height: verticalScale(68),
      position: 'relative',
    },
    errorText: {
      position: 'absolute',
      bottom: verticalScale(-13),
      fontSize: moderateScale(12),
      color: theme.color.red,
      fontFamily: fontFamily.regular,
      marginTop: Platform.OS === 'android' ? verticalScale(12) : 0,
    },
    focusedContainer: {
      borderColor: theme.color.textPrimary,
    },
    dropdown: {
      paddingHorizontal: verticalScale(24),
      height: verticalScale(56),
      width: '100%',
      borderColor: theme.color.grey,
      borderWidth: 0.5,
      borderRadius: 8,
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: theme.color.red,
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14,
    },
    errorContainer: {
      borderColor: theme.color.red,
    },
    labelContainer: {
      flexDirection: 'row',
      position: 'absolute',
      zIndex: 1,
      marginLeft: verticalScale(16),
      backgroundColor: theme.color.backgroundWhite,
      textAlign: 'center',
      pointerEvents: 'none',
    },
    selectedTextStyle: {
      color: theme.color.textPrimary,
      ...fonts.medium,
    },
    item: {
      padding: verticalScale(10),
    },
    labelText: {
      color: theme.color.disabled,
      ...fonts.medium,
    },
    value: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
  });
};
