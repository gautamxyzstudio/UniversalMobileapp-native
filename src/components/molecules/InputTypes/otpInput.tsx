import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import OTPTextView from 'react-native-otp-textinput';
import {useTheme} from '@theme/Theme.context';
import BackgroundTimer from 'react-native-background-timer';
import {minTwoDigits} from '@utils/utils.common';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import Statement from '../statement';

type OtpInputPropsType = {
  value: string;
  onChangeText: (e: string) => void;
  onPressText: () => void;
  restartTimer?: boolean;
};

const OtpInput: React.FC<OtpInputPropsType> = ({
  value,
  onChangeText,
  onPressText,
  restartTimer,
}) => {
  const {theme} = useTheme();
  const countTime = 30;
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [countDown, setCountDown] = useState(countTime);
  const styles = createStyles(theme);

  useEffect(() => {
    if (countDown > 0) {
      BackgroundTimer.runBackgroundTimer(() => {
        setCountDown(secs => {
          if (secs <= 0) {
            BackgroundTimer.stopBackgroundTimer();
            return 0;
          }
          return secs - 1;
        });
      }, 1000);
    }
    return () => {
      BackgroundTimer.stopBackgroundTimer();
    };
  }, [countDown]);

  useEffect(() => {
    if (restartTimer) {
      setCountDown(countTime);
    }
  }, [restartTimer]);

  useEffect(() => {
    setIsTimerActive(countDown <= 0 ? false : true);
  }, [countDown]);

  const onPressResend = () => {
    setCountDown(countTime);
    onPressText();
  };

  const renderTimer = () => {
    let seconds = minTwoDigits(countDown);
    return <Text style={styles.timerText}>{`00:${seconds}`}</Text>;
  };

  // const handleCellTextChange = (text: string, cellIndex: number) => {
  //   if (cellIndex === 3) {
  //     Keyboard.dismiss();
  //   }
  // };

  return (
    <View>
      <OTPTextView
        containerStyle={styles.mainView}
        handleTextChange={onChangeText}
        // handleCellTextChange={handleCellTextChange}
        textInputStyle={styles.otpInput}
        inputCount={6}
        defaultValue={value}
        keyboardType="numeric"
        tintColor={theme.color.darkBlue}
      />
      {renderTimer()}
      <View style={styles.otpContainer}>
        <Statement
          isDisabled={isTimerActive}
          containerStyles={undefined}
          onTextPress={onPressResend}
          normalText={STRINGS.Don_receive_the_otp}
          focusedText={STRINGS.resendOtp}
        />
      </View>
    </View>
  );
};

export default OtpInput;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    otpInput: {
      borderWidth: 1,
      borderBottomWidth: 1,
      borderRadius: 100,
    },
    mainView: {
      alignSelf: 'center',
    },
    timerText: {
      color: color.disabled,
      alignSelf: 'center',
      ...fonts.small,
      marginTop: verticalScale(12),
    },
    resendOtp: {
      color: color.darkBlue,
      alignSelf: 'center',
      ...fonts.small,
    },
    otpContainer: {
      alignItems: 'center',
      marginTop: verticalScale(16),
    },
  });
  return styles;
};
