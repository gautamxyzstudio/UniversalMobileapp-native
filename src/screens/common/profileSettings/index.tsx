import {StyleSheet, View} from 'react-native';
import React, {useCallback, useRef} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import EmployeeProfileTab from '@components/employee/EmployeeProfileTab';
import {
  BIN,
  DELETE_SECONDARY,
  HELP_SECONDARY,
  LANGUAGE_ICON,
} from '@assets/exporter';
import ActionPopup from '@components/molecules/ActionPopup';
import {customModalRef} from '@components/molecules/customModal/types';
import GetHelpBottomSheet from '@components/molecules/GetHelpBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const ProfileSettings = () => {
  const popupRef = useRef<customModalRef>(null);
  const helpSheetRef = useRef<BottomSheetModal>(null);

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
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack headerTitle={STRINGS.settings} isDark />
      <View style={styles.container}>
        <EmployeeProfileTab
          title={STRINGS.language}
          Icon={LANGUAGE_ICON}
          onPressTab={() => undefined}
        />
        <EmployeeProfileTab
          title={STRINGS.help}
          Icon={HELP_SECONDARY}
          onPressTab={onPressHelp}
        />
        <EmployeeProfileTab
          title={STRINGS.deleteAccount}
          Icon={DELETE_SECONDARY}
          onPressTab={onPressAccountDelete}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: verticalScale(40),
    gap: verticalScale(16),
  },
});
