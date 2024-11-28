import {StyleSheet, View} from 'react-native';
import React, {useCallback, useRef} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import EmployeeProfileTab from '@components/employee/EmployeeProfileTab';
import {BIN, HELP_SECONDARY, PRIVACY_POLICY} from '@assets/exporter';
import ActionPopup from '@components/molecules/ActionPopup';
import {customModalRef} from '@components/molecules/customModal/types';
import GetHelpBottomSheet from '@components/molecules/GetHelpBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {useTheme} from '@theme/Theme.context';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';

const ProfileSettings = () => {
  const popupRef = useRef<customModalRef>(null);
  const helpSheetRef = useRef<BottomSheetModal>(null);
  const {theme} = useTheme();
  const styles = useThemeAwareObject(createStyles);
  const navigation = useNavigation<NavigationProps>();
  const onPressAccountDelete = useCallback(() => {
    popupRef.current?.handleModalState(true);
  }, []);

  const onPressDelete = useCallback(() => {
    popupRef.current?.handleModalState(false);
  }, []);

  const onPressHelp = useCallback(() => {
    helpSheetRef.current?.snapToIndex(1);
  }, []);

  return (
    <SafeAreaView
      backgroundColor={theme.color.backgroundWhite}
      paddingHorizontal>
      <HeaderWithBack headerTitle={STRINGS.settings} isDark />
      <View style={styles.container}>
        <EmployeeProfileTab
          title={STRINGS.help}
          Icon={HELP_SECONDARY}
          onPressTab={onPressHelp}
        />
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
      <GetHelpBottomSheet ref={helpSheetRef} />
    </SafeAreaView>
  );
};

export default ProfileSettings;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.color.backgroundWhite,
      marginTop: verticalScale(40),
      gap: verticalScale(16),
    },
  });
