import {Linking, StyleSheet, Text, View} from 'react-native';
import React, {useRef} from 'react';
import OnBoardingBackground from '@components/organisms/onboardingb';
import {
  APPROVAL,
  CONTACT,
  FAQ,
  LOGOUT_SECONDARY,
  MEAT_BALL_WHiTE,
  ORANGE_LOGOUT,
} from '@assets/exporter';
import {STRINGS} from 'src/locales/english';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import SelectOptionBottomSheet from '@components/organisms/selectOptionBottomSheet';
import ContactUsBottomSheet from '@components/organisms/contactUsBottomsheet';
import FaqBottomSheet from '@components/organisms/FaqBottomSheet';
import {useSelector} from 'react-redux';
import {userAdvanceDetailsFromState} from '@api/features/user/userSlice';
import ActionPopup from '@components/molecules/ActionPopup';
import {customModalRef} from '@components/molecules/customModal/types';
import store from '@api/store';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from 'src/navigator/types';
import {timeOutTimeSheets} from 'src/constants/constants';
import {companyEmail} from '@utils/constants';
import {showToast} from '@components/organisms/customToast';
import {useToast} from 'react-native-toast-notifications';

const Approval = () => {
  const bottomSheetRef = useRef<BottomSheetModal | null>(null);
  const bottomSheetRefFaqs = useRef<BottomSheetModal | null>(null);
  const bottomSheetRefContactUs = useRef<BottomSheetModal | null>(null);
  const client = useSelector(userAdvanceDetailsFromState);
  const popupRef = useRef<customModalRef>(null);
  const toast = useToast();
  const navigation = useNavigation<NavigationProps>();

  console.log(client, 'client');
  const onPressContactUs = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      bottomSheetRefContactUs.current?.snapToIndex(1);
    }, timeOutTimeSheets);
  };

  const launchEmailHandler = () => {
    bottomSheetRefContactUs.current?.snapToIndex(0);
    setTimeout(() => {
      const mailto = `mailto:${companyEmail}`;
      Linking.openURL(mailto).catch(err =>
        showToast(toast, 'Error opening mail app:', 'error'),
      );
    }, timeOutTimeSheets);
  };

  const onPressFaqs = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      bottomSheetRefFaqs.current?.snapToIndex(1);
    }, timeOutTimeSheets);
  };

  const onPressLogoutButton = () => {
    bottomSheetRef.current?.close();
    setTimeout(() => {
      popupRef.current?.handleModalState(true);
    }, timeOutTimeSheets);
  };

  const onPressLogout = () => {
    popupRef.current?.handleModalState(false);
    setTimeout(() => {
      store.dispatch({type: 'RESET'});
      navigation.reset({
        index: 0,
        routes: [{name: 'onBoarding'}],
      });
    }, 350);
  };

  return (
    <OnBoardingBackground
      hideBack={true}
      title={STRINGS.approval}
      subTitle={'Lorem Ipsum is simply dummy text'}
      displayRightIcon={true}
      rightIconPressHandler={() => bottomSheetRef.current?.snapToIndex(1)}
      rightIcon={MEAT_BALL_WHiTE}>
      <View style={styles.container}>
        <APPROVAL width={verticalScale(208)} height={verticalScale(208)} />
        <Text style={styles.heading}>{STRINGS.approvalText}</Text>
      </View>
      <SelectOptionBottomSheet
        ref={bottomSheetRef}
        modalHeight={verticalScale(308)}
        options={[
          {
            icon: FAQ,
            title: STRINGS.fAQs,
            onPress: onPressFaqs,
          },
          {
            icon: CONTACT,
            title: STRINGS.contact,
            onPress: onPressContactUs,
          },
          {
            icon: ORANGE_LOGOUT,
            title: STRINGS.logOut,
            onPress: onPressLogoutButton,
          },
        ]}
      />
      <ContactUsBottomSheet
        ref={bottomSheetRefContactUs}
        onPressEmail={launchEmailHandler}
      />
      <FaqBottomSheet ref={bottomSheetRefFaqs} />
      <ActionPopup
        ref={popupRef}
        title={STRINGS.are_you_sure_you_want_to_logout_this_account}
        buttonTitle={STRINGS.logOut}
        icon={LOGOUT_SECONDARY}
        buttonPressHandler={onPressLogout}
        type={'error'}
      />
    </OnBoardingBackground>
  );
};

export default Approval;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: verticalScale(112),

    alignItems: 'center',
  },
  heading: {
    alignSelf: 'center',
    marginTop: 36,
    textAlign: 'center',
    color: '#000',
    ...fonts.medium,
  },
});
