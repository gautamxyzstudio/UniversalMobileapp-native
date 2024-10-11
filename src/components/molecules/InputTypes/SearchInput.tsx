/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import CustomTextInput from '@components/atoms/customtextInput';
import {useTheme} from '@theme/Theme.context';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fontFamily, fonts} from '@utils/common.styles';
import {moderateScale, verticalScale} from '@utils/metrics';
import {ARROW_LEFT, IC_CROSS, SEARCH} from '@assets/exporter';
import {
  NavigationProp,
  NavigationState,
  useNavigation,
} from '@react-navigation/native';
import {StyleProps} from 'react-native-reanimated';
import {Row} from '@components/atoms/Row';
import {ActivityIndicator} from 'react-native-paper';

type ISearchInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onPressCross: () => void;
  showLoader: boolean;
  placeHolder: string;
  leftIcon?: boolean;
  innerContainerStyle?: StyleProp<ViewStyle>;
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
  showLoader,
  innerContainerStyle,
  placeHolder,
  onPressCross,
  inputRef,
}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={styles.inputMain}>
      <Row alignCenter style={{height: 40}}>
        <View style={styles.leftIcon}>
          {leftIcon && (
            <View>
              {withBack ? (
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <ARROW_LEFT />
                </TouchableOpacity>
              ) : (
                <Pressable style={styles.leftIcon}>
                  <SEARCH />
                </Pressable>
              )}
            </View>
          )}
        </View>
        <TextInput
          value={value}
          style={styles.textInput}
          placeholder={placeHolder}
          onChangeText={onChangeText}
          placeholderTextColor={theme.color.disabled}
        />
        <View>
          {value && (
            <>
              {showLoader ? (
                <View style={styles.rightIcon}>
                  <ActivityIndicator
                    size={'small'}
                    color={theme.color.darkBlue}
                  />
                </View>
              ) : (
                <Pressable onPress={onPressCross} style={styles.rightIcon}>
                  <IC_CROSS />
                </Pressable>
              )}
            </>
          )}
        </View>
      </Row>
    </View>
  );
};

export default SearchInput;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    textInput: {
      flex: 1,
      justifyContent: 'center',
      paddingTop: verticalScale(10),
      fontFamily: fontFamily.regular,
      lineHeight: verticalScale(20),
      color: theme.color.textPrimary,
      fontSize: moderateScale(14),
    },
    inputMain: {
      height: verticalScale(40),
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: theme.color.strokeLight,
    },
    leftIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: verticalScale(8),
    },
    rightIcon: {
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      marginRight: verticalScale(12),
    },
  });
  return styles;
};
