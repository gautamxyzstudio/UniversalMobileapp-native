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
import React from 'react';
import {useTheme} from '@theme/Theme.context';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {fonts} from '@utils/common.styles';
import {moderateScale, verticalScale} from '@utils/metrics';
import {ARROW_LEFT, IC_CROSS, SEARCH} from '@assets/exporter';
import {NavigationProp, NavigationState} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import Spacers from '@components/atoms/Spacers';

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
  onPressDone?: () => void;
};

const SearchInput: React.FC<ISearchInputProps> = ({
  value,
  onChangeText,
  navigation,
  withBack = true,
  leftIcon = true,
  inputRef,
  onPressDone,
  showLoader,
  placeHolder,
  onPressCross,
}) => {
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={styles.inputMain}>
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
      <Spacers size={8} scalable type="horizontal" />
      <TextInput
        value={value}
        ref={inputRef}
        style={styles.textInput}
        onBlur={onPressDone}
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
    </View>
  );
};

export default SearchInput;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    textInput: {
      flex: 1,
      color: theme.color.textPrimary,
      margin: 0,
      padding: 0,
      ...fonts.regular,
      lineHeight:
        Platform.OS === 'android' ? moderateScale(28) : moderateScale(18),
    },
    inputMain: {
      flexDirection: 'row',
      height: verticalScale(40),
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.color.strokeLight,
      borderRadius: 40,
    },
    leftIcon: {
      marginLeft: verticalScale(8),
    },
    rightIcon: {
      marginRight: verticalScale(12),
    },
  });
  return styles;
};
