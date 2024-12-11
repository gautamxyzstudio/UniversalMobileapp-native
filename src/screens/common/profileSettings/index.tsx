import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import React, {useCallback, useRef} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import EmployeeProfileTab from '@components/employee/EmployeeProfileTab';
import {BIN, PRIVACY_POLICY} from '@assets/exporter';
import ActionPopup from '@components/molecules/ActionPopup';
import {customModalRef} from '@components/molecules/customModal/types';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';

const ProfileSettings = () => {
  const popupRef = useRef<customModalRef>(null);
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  const onPressAccountDelete = useCallback(() => {
    popupRef.current?.handleModalState(true);
  }, []);

  const onPressDelete = useCallback(() => {
    popupRef.current?.handleModalState(false);
  }, []);

  return (
    <SafeAreaView
      backgroundColor={theme.color.backgroundWhite}
      paddingHorizontal>
      <HeaderWithBack headerTitle={STRINGS.settings} isDark />
      <View style={styles.container}>
        <EmployeeProfileTab
          title={STRINGS.deleteAccount}
          Icon={BIN}
          onPressTab={onPressAccountDelete}
        />
        <EmployeeProfileTab
          title={STRINGS.privacy_Policy}
          Icon={PRIVACY_POLICY}
          onPressTab={() => navigation.navigate('privacyPolicy')}
        />
      </View>
      <ActionPopup
        ref={popupRef}
        title={STRINGS.are_you_sure_you_want_to_delete_your_account_permanently}
        buttonTitle={STRINGS.delete}
        icon={BIN}
        buttonPressHandler={onPressDelete}
        type={'delete'}
      />
      {Platform.OS === 'android' && (
        <StatusBar
          translucent={true}
          barStyle="dark-content"
          backgroundColor={theme.color.backgroundWhite}
        />
      )}
    </SafeAreaView>
  );
};

export default ProfileSettings;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.backgroundWhite,
      marginTop: verticalScale(24),
      gap: verticalScale(16),
    },
  });
