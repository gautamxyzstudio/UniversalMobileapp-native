/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {useTheme} from '@theme/Theme.context';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {ARROW_LEFT, IC_CROSS, SEARCH} from '@assets/exporter';
import {
  NavigationProp,
  NavigationState,
  useNavigation,
} from '@react-navigation/native';
import {StyleProps} from 'react-native-reanimated';

type ISearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onPressCross: () => void;
  placeHolder: string;
  leftIcon?: boolean;
  containerStyles?: StyleProp<ViewStyle>;
  navigation: Omit<
    NavigationProp<ReactNavigation.RootParamList>,
    'getState'
  > & {
    getState(): NavigationState | undefined;
  };
  withBack?: boolean;
  inputRef?: React.LegacyRef<TextInput>;
};

const SearchInput: React.FC<ISearchInputProps> = ({
  value,
  onChangeText,
  navigation,
  withBack = true,
  containerStyles,
  leftIcon = true,
  placeHolder,
  onPressCross,
  inputRef,
}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <CustomTextInput
      title={''}
      ref={inputRef}
      innerContainerStyles={styles.innerContainerStyles}
      outerContainerStyles={[styles.outerContainerStyles, containerStyles]}
      placeholder={placeHolder}
      textInputStyles={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={theme.color.disabled}
      hideTitle
      left={
        <View style={styles.leftIcon}>
          {leftIcon && (
            <View>
              {withBack ? (
                <ARROW_LEFT onPress={() => navigation.goBack()} />
              ) : (
                <Pressable style={styles.leftIcon}>
                  <SEARCH />
                </Pressable>
              )}
            </View>
          )}
        </View>
      }
      right={
        <View>
          {value && (
            <Pressable onPress={onPressCross} style={styles.rightIcon}>
              <IC_CROSS />
            </Pressable>
          )}
        </View>
      }
      errorMessage={''}
    />
  );
};

export default SearchInput;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    textInput: {
      ...fonts.regular,
      paddingHorizontal: verticalScale(8),
    },
    innerContainerStyles: {
      justifyContent: 'center',
      alignItems: 'center',
      height: verticalScale(40),
      borderRadius: 40,
      backgroundColor: '#fff',
    },
    outerContainerStyles: {
      height: verticalScale(40),
    },
    leftIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: verticalScale(16),
    },
    rightIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: verticalScale(12),
    },
  });
  return styles;
};
