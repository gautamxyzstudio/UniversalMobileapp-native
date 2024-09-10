import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {STRINGS} from 'src/locales/english';
import {Country} from 'react-native-country-picker-modal';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {
  formatPhoneNumber,
  getPhoneNumberAndCountryCode,
  phoneNumberWithCountryCode,
} from '@utils/constants';
import PopupInput from './PopupInput';
import PhoneVerificationBottomSheet from '@components/organisms/phoneVerficationBottomSheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';
import {verticalScale} from '@utils/metrics';
import {EDIT_PROFILE} from '@assets/exporter';

type IPhoneNumberInputProps = {
  getSelectedPhoneNumber: (number: string) => void;
  errorMessage: string;
  compRef?: React.LegacyRef<TextInput>;
  value?: string;
  isDisabled?: boolean;
  withCode?: boolean;
};

const PhoneNumberInput: React.FC<IPhoneNumberInputProps> = ({
  errorMessage,
  getSelectedPhoneNumber,
  compRef,
  isDisabled,
  value,
}) => {
  const [countryCode, setCountryCode] = useState<string>();
  const styles = useThemeAwareObject(createStyles);
  const sheetRef = useRef<BottomSheetMethods | null>(null);
  const theme = useTheme();
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    if (value) {
      const number = getPhoneNumberAndCountryCode(value);
      setInput(formatPhoneNumber(number.phoneNumber ?? ''));
      setCountryCode(number.countryCode ?? '');
    }
  }, [value]);

  const onPressInput = () => {
    sheetRef.current?.snapToIndex(1);
  };

  const onVerifyPhoneNumber = ({
    country,
    number,
  }: {
    country: Country;
    number: string;
  }) => {
    setInput(number);
    setCountryCode(country.callingCode[0]);
    let phNumber = phoneNumberWithCountryCode(country.callingCode[0], number);
    getSelectedPhoneNumber(phNumber);
  };
  return (
    <>
      <PopupInput
        title={STRINGS.contactNumber}
        value={input}
        textInputStyles={styles.textInput}
        isDisabled={isDisabled}
        compRef={compRef}
        onPressInput={onPressInput}
        right={
          <TouchableOpacity onPress={onPressInput} style={styles.right}>
            <EDIT_PROFILE />
          </TouchableOpacity>
        }
        left={
          countryCode && (
            <View style={styles.pickerOuter}>
              <Text
                style={[
                  styles.code,
                  isDisabled && {color: theme.theme.color.disabled},
                ]}>
                +{countryCode} -
              </Text>
            </View>
          )
        }
        errorMessage={errorMessage}
      />
      <PhoneVerificationBottomSheet
        ref={sheetRef}
        getPhoneNumber={onVerifyPhoneNumber}
      />
    </>
  );
};

export default PhoneNumberInput;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    pickerOuter: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: verticalScale(16),
    },
    pickerContainer: {
      paddingHorizontal: 5,
      borderRightWidth: 2,
      borderRightColor: theme.color.grey,
    },
    code: {
      paddingTop: 0,
      paddingBottom: 0,
      color: theme.color.textPrimary,
      ...fonts.medium,
    },
    textInput: {
      paddingHorizontal: verticalScale(0),
    },
    right: {
      justifyContent: 'center',
      alignItems: 'center',
      paddingRight: verticalScale(16),
    },
  });
  return styles;
};
