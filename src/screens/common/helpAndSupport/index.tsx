import {StyleSheet, View} from 'react-native';
import React, {useRef} from 'react';
import SafeAreaView from '@components/safeArea';
import HeaderWithBack from '@components/atoms/headerWithBack';
import HelpAndSupportCard from '@components/organisms/helpAndSupportCard';
import {IHelpAndSupportTicketStatus} from '@utils/enums';
import BottomButtonView from '@components/organisms/bottomButtonView';
import GetHelpBottomSheet from '@components/molecules/GetHelpBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';

const HelpAndSupport = () => {
  const helpSheetRef = useRef<BottomSheetModal>(null);

  const onPress = () => {
    helpSheetRef.current?.snapToIndex(1);
  };
  return (
    <SafeAreaView paddingHorizontal>
      <HeaderWithBack headerTitle="Help" />
      <View style={styles.container}>
        <HelpAndSupportCard
          date={new Date()}
          status={IHelpAndSupportTicketStatus.OPEN}
          description={
            'Lorem Ipsum is simply dummy text of the printing and typesetting industry.'
          }
        />
      </View>
      <BottomButtonView
        disabled={false}
        title="Get Help"
        onButtonPress={onPress}
      />
      <GetHelpBottomSheet ref={helpSheetRef} />
    </SafeAreaView>
  );
};

export default HelpAndSupport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
