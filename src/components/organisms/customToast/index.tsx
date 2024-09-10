import {Platform, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {ToastProps} from 'react-native-toast-notifications/lib/typescript/toast';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {verticalScale, windowWidth} from '@utils/metrics';
import {CROSS, ERROR, GREEN_TICK} from '@assets/exporter';
import {fonts} from '@utils/common.styles';
import {STRINGS} from 'src/locales/english';
import {ToastType} from 'react-native-toast-notifications';

type ICustomToastProps = {
  toast: ToastProps;
};

export const showToast = (
  toast: ToastType,
  message: string,
  type: 'success' | 'error',
) => {
  toast.hideAll();
  toast.show(message, {
    type: type,
  });
};

const CustomToast: React.FC<ICustomToastProps> = ({toast}) => {
  const theme = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            toast.type === 'success'
              ? theme.theme.color.greenLight
              : theme.theme.color.redLight,
        },
      ]}>
      {toast.type === 'success' && (
        <View style={styles.leftView}>
          <GREEN_TICK width={verticalScale(16)} height={verticalScale(16)} />
          <View style={styles.textView}>
            <Text style={styles.title}>{toast.message}</Text>
            {toast?.data?.subtitle && (
              <Text style={styles.subTitle}>{toast?.data?.subtitle}</Text>
            )}
          </View>
        </View>
      )}
      {toast.type === 'error' && (
        <View style={styles.leftView}>
          <ERROR width={verticalScale(16)} height={verticalScale(16)} />
          <View style={styles.textView}>
            <Text style={styles.title}>{STRINGS.error}</Text>
            <Text style={styles.subTitle}>{toast.message}</Text>
          </View>
        </View>
      )}

      {toast.type === 'error' && (
        <TouchableOpacity onPress={toast.onHide}>
          <CROSS width={verticalScale(16)} height={verticalScale(16)} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomToast;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      height: verticalScale(46),
      flexDirection: 'row',
      width: windowWidth - verticalScale(48),
      borderRadius: 8,
      paddingHorizontal: verticalScale(12),
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: verticalScale(7),
      ...Platform.select({
        ios: {
          shadowColor: '#121212',
          shadowOffset: {width: 0, height: 0},
          shadowOpacity: 0.24,
          shadowRadius: 8,
        },
        android: {
          elevation: 12,
          shadowOpacity: 0.24,
          shadowRadius: 8,
        },
      }),
    },
    leftView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    textView: {
      marginLeft: verticalScale(12),
    },
    title: {
      ...fonts.regularBold,
      color: theme.color.textPrimary,
    },
    subTitle: {
      ...fonts.extraSmall,
      color: theme.color.disabled,
    },
  });
