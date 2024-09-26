import {Keyboard, StyleSheet, Text, View} from 'react-native';
import React, {useMemo, useRef, useState} from 'react';
import {BaseBottomSheet} from '@components/molecules/bottomsheet';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {verticalScale, windowWidth} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import BottomButtonView from '../bottomButtonView';
import CountryPicker, {Country} from 'react-native-country-picker-modal';
import {canadaCountyData} from 'src/constants/staticData';
import CustomTextInput from '@components/atoms/customtextInput';
import {
  decodePhoneNumber,
  formatPhoneNumber,
  isValidContact,
  phoneNumberWithCountryCode,
} from '@utils/constants';
import {useKeyboardHeight} from 'src/hooks/useKeyboardHeight';
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet';
import {
  useSentOptMobileMutation,
  useVerifyOptMobileMutation,
} from '@api/features/user/userApi';
import OtpInput from '@components/molecules/InputTypes/otpInput';
import {fonts} from '@utils/common.styles';
import Toast from 'react-native-toast-notifications';
import {useTheme} from '@theme/Theme.context';

type IPhoneVerificationBottomSheetProps = {
  initialPhoneNumber?: string;
  initialCountryCode?: string;
  getPhoneNumber: ({
    number,
    country,
  }: {
    number: string;
    country: Country;
  }) => void;
};

const PhoneVerificationBottomSheet = React.forwardRef<
  BottomSheetMethods,
  IPhoneVerificationBottomSheetProps
>(({getPhoneNumber}, ref) => {
  const [inputState, setInputState] = useState<{
    inputError: string;
    inputDisplay: string;
  }>({inputDisplay: '', inputError: ''});
  const styles = useThemeAwareObject(createStyles);
  const toastRef = useRef<Toast | null>(null);
  const [restartTimer, setRestartTimer] = useState<boolean>(false);
  const [country, selectedCountry] = useState<Country>(canadaCountyData as any);
  const [headerTitle, setHeaderTitle] = useState<'Contact' | 'OTP'>('Contact');
  const [sendOtp] = useSentOptMobileMutation();
  const [verifyOtp] = useVerifyOptMobileMutation();
  const [otp, setOtp] = useState('');
  const [isOtpView, setIsOtpView] = useState(false);
  const scrollViewRef = useRef<BottomSheetScrollViewMethods | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const {theme} = useTheme();
  const keyboardHeight = useKeyboardHeight();
  const tabWidth = windowWidth;

  const modalHeight = useMemo(
    () => (headerTitle === 'Contact' ? verticalScale(320) : verticalScale(480)),
    [headerTitle],
  );
  const snapPoints = useMemo(
    () => [0.01, modalHeight, modalHeight + keyboardHeight],
    [modalHeight, keyboardHeight],
  );

  const onPressVerify = async () => {
    const phone = decodePhoneNumber(inputState.inputDisplay);
    const isValid = isValidContact(phone);
    if (!isOtpView) {
      if (isValid) {
        try {
          const sendOtpOk = await sendOtpHandler();
          if (sendOtpOk) {
            setIsOtpView(true);
          }
        } catch (error) {
          let customError = error as any;
          toastRef.current?.show(`${customError?.data?.error as string}`, {
            type: 'success',
            style: {
              backgroundColor: theme.color.redLight,
              width: '100%',
            },
            textStyle: {
              color: theme.color.red,
            },
          });
        } finally {
          setShowLoader(false);
        }
      } else {
        setInputState(prev => ({
          ...prev,
          inputDisplay: '',
          inputError: STRINGS.validPhoneNumber,
        }));
      }
    } else {
      verifyOtpHandler();
    }
  };

  const sendOtpHandler = async (): Promise<boolean> => {
    const phone = decodePhoneNumber(inputState.inputDisplay);
    try {
      setShowLoader(true);
      const response = await sendOtp({
        phoneNumber: phoneNumberWithCountryCode(country.callingCode[0], phone),
      }).unwrap();
      if (response) {
        setHeaderTitle('OTP');
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            x: 2 * windowWidth - verticalScale(16),
            animated: true,
          });
          setRestartTimer(!restartTimer);
        }, 500);
        return true;
      }
      return false;
    } catch (error) {
      toastRef.current?.show('unable to send otp', {
        type: 'success',
        style: {
          backgroundColor: theme.color.redLight,
          width: '100%',
        },
        textStyle: {
          color: theme.color.red,
        },
      });
      throw error;
    } finally {
      setShowLoader(false);
    }
  };

  const verifyOtpHandler = async () => {
    const phone = decodePhoneNumber(inputState.inputDisplay);
    try {
      setShowLoader(true);
      let phNumber = phoneNumberWithCountryCode(country.callingCode[0], phone);
      const verifyOtpResponse = await verifyOtp({
        phoneNumber: phNumber,
        code: otp,
      }).unwrap();

      if (verifyOtpResponse.valid) {
        getPhoneNumber({
          number: phone,
          country: country,
        });
        onClose();
      } else {
        toastRef.current?.show('Invalid Otp', {
          type: 'error',
          style: {
            backgroundColor: theme.color.redLight,
            width: '100%',
          },
          textStyle: {
            color: theme.color.red,
          },
        });
      }
    } catch (error) {
      toastRef.current?.show('something went wrong', {
        type: 'error',
        style: {
          backgroundColor: theme.color.redLight,
          width: '100%',
        },
        textStyle: {
          color: theme.color.red,
        },
      });
    } finally {
      setShowLoader(false);
    }
  };

  const onClose = () => {
    //@ts-ignore
    ref.current?.snapToIndex(0);
    scrollViewRef.current?.scrollTo({x: 0});
    setIsOtpView(false);
    setInputState({inputDisplay: '', inputError: ''});
    setRestartTimer(!restartTimer);
    setOtp('');
    setHeaderTitle('Contact');
  };

  const onTextChangeNumberInput = (e: string) => {
    console.log(e);
    setInputState(prev => ({...prev, inputError: '', inputDisplay: e}));
  };

  const onChangeOtpHandler = (e: string) => {
    if (e.length === 6) {
      Keyboard.dismiss();
    }
    setOtp(e);
  };

  return (
    <BaseBottomSheet
      headerTitle={headerTitle}
      ref={ref}
      snapPoints={snapPoints}
      onClose={onClose}>
      <View style={styles.container}>
        <BottomSheetScrollView
          ref={scrollViewRef}
          scrollEnabled={false}
          horizontal>
          <View style={[styles.element, {width: tabWidth}]}>
            <CustomTextInput
              title={STRINGS.contactNumber}
              left={
                <View style={styles.pickerOuter}>
                  <CountryPicker
                    countryCodes={['CA', 'US', 'VG', 'MX', 'IN']}
                    containerButtonStyle={styles.pickerContainer}
                    onSelect={country => selectedCountry(country)}
                    visible={false}
                    withCallingCode
                    withFlagButton={true}
                    withAlphaFilter
                    withFilter
                    withCountryNameButton={false}
                    withCallingCodeButton
                    withFlag
                    countryCode={country.cca2 as any}
                  />
                </View>
              }
              onTextChange={e => onTextChangeNumberInput(e)}
              value={formatPhoneNumber(inputState.inputDisplay)}
              keyboardType="number-pad"
              maxLength={14}
              errorMessage={inputState.inputError}
            />
          </View>
          <View
            style={[styles.element, {width: tabWidth, alignItems: 'center'}]}>
            <Text style={styles.otpTitle}>{STRINGS.OtpSendMobile}</Text>
            <Text style={styles.number}>
              {phoneNumberWithCountryCode(
                country.callingCode[0],
                decodePhoneNumber(inputState.inputDisplay),
              )}
            </Text>
            <OtpInput
              value={otp}
              restartTimer={restartTimer}
              onChangeText={onChangeOtpHandler}
              onPressText={sendOtpHandler}
            />
          </View>
        </BottomSheetScrollView>
      </View>
      <BottomButtonView
        isLoading={showLoader}
        disabled={false}
        title={STRINGS.verify}
        onButtonPress={onPressVerify}
      />
      <Toast ref={toastRef} />
    </BaseBottomSheet>
  );
});

export default PhoneVerificationBottomSheet;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      // paddingHorizontal: verticalScale(16),
      paddingVertical: verticalScale(24),
      flexGrow: 1,
      justifyContent: 'center',
    },
    pickerOuter: {justifyContent: 'center', alignItems: 'center'},
    pickerContainer: {
      paddingHorizontal: 5,
      borderRightWidth: 2,
      borderRightColor: theme.color.grey,
    },
    element: {
      paddingHorizontal: verticalScale(24),
      flex: 1,
    },
    otpTitle: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    number: {
      marginTop: verticalScale(8),
      marginBottom: verticalScale(40),
      color: theme.color.disabled,
      ...fonts.medium,
    },
  });
