import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {ToastProps} from 'react-native-toast-notifications/lib/typescript/toast';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {verticalScale, windowWidth} from '@utils/metrics';
import {CROSS, ERROR, GREEN_TICK, ICONS} from '@assets/exporter';
import {fonts} from '@utils/common.styles';
import {STRINGS} from 'src/locales/english';

type ICustomToastProps = {
  toast: ToastProps;
};

export const showToast = (
  toast: any,
  message: string,
  type: 'success' | 'error' | 'notification',
  subtitle?: string,
) => {
  toast.hideAll();
  toast.show(message, {
    type: type,
    placement: type === 'notification' ? 'top' : 'bottom',
    data: {
      subtitle: subtitle,
    },
  });
};

const CustomToast: React.FC<ICustomToastProps> = ({toast}) => {
  const theme = useTheme();
  const styles = useThemeAwareObject(createStyles);

  return (
    <View>
      {toast.type === 'notification' ? (
        <View style={[styles.notificationContainer]}>
          <Image
            source={ICONS.notificationIcon}
            style={styles.notificationImage}
          />
          <View style={styles.notificationTextContainer}>
            <Text style={styles.notificationTitle}>{toast.message}</Text>
            <Text style={styles.notificationSubtitle}>
              {toast?.data?.subtitle}
            </Text>
          </View>
        </View>
      ) : (
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
              <GREEN_TICK
                width={verticalScale(16)}
                height={verticalScale(16)}
              />
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
    notificationContainer: {
      flexDirection: 'row',
      width: windowWidth - verticalScale(48),
      borderRadius: 8,
      backgroundColor: theme.color.backgroundWhite,
      paddingHorizontal: verticalScale(12),
      justifyContent: 'flex-start',
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
    notificationImage: {
      width: verticalScale(40),
      borderRadius: 8,
      height: verticalScale(40),
    },
    notificationTextContainer: {
      flex: 1,
      marginLeft: verticalScale(12),
    },
    notificationTitle: {
      ...fonts.headingSmall,
      color: theme.color.textPrimary,
    },
    notificationSubtitle: {
      ...fonts.regular,
      color: theme.color.disabled,
    },
  });
