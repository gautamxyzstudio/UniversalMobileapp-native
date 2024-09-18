import {StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import CardOuter from '@components/atoms/CardOuter';
import CandidateProfilePictureView from './CandidateProfilePictureView';
import {ICandidateStatusEnum} from '@utils/enums';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import Spacers from '@components/atoms/Spacers';
import CustomButton from '@components/molecules/customButton';
import {useTheme} from '@theme/Theme.context';
import CheckinCheckoutBottomSheet from './CheckinCheckoutBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {IC_CHECKIN_GREEN, IC_CHECKOUT} from '@assets/exporter';

const ShortlistedCandidateCard = () => {
  const {theme} = useTheme();
  const sheetRef = useRef<BottomSheetModal | null>(null);
  const [attendance, setAttendance] = useState<{
    checkin: null | Date;
    checkout: null | Date;
  }>({
    checkin: null,
    checkout: null,
  });

  const onPressConfirm = (date: Date, type: 'checkin' | 'checkout') => {
    setAttendance(prev => ({...prev, type: type}));
    sheetRef.current?.snapToIndex(0);
  };
  return (
    <CardOuter>
      <>
        <Row alignCenter>
          <CandidateProfilePictureView
            name={'NONE'}
            url={null}
            textSize="small"
            size={verticalScale(32)}
            status={ICandidateStatusEnum.selected}
          />
          <Spacers size={12} scalable type={'horizontal'} />
          <View>
            <CustomText value={'Ashwani kaur'} size={textSizeEnum.mediumBold} />
            <CustomText
              color="disabled"
              value={'12 May 2024'}
              size={textSizeEnum.small}
            />
          </View>
        </Row>
        <Spacers type={'vertical'} size={16} scalable />
        <Row alignCenter spaceBetween>
          <CustomText
            color="disabled"
            value={'Emp ID'}
            size={textSizeEnum.regular}
          />
          <CustomText value={'34574'} size={textSizeEnum.regular} />
        </Row>
        <Spacers type={'vertical'} size={8} scalable />
        <Row alignCenter spaceBetween>
          <CustomText
            color="disabled"
            value={'Licence number'}
            size={textSizeEnum.regular}
          />
          <CustomText value={'873842858732'} size={textSizeEnum.regular} />
        </Row>
        <Spacers type={'vertical'} size={24} scalable />
        <Row spaceBetween>
          {attendance.checkin ? (
            <Row alignCenter style={styles.buttonShadow}>
              <IC_CHECKIN_GREEN />
              <View style={styles.view}>
                <CustomText
                  value={'Checkin'}
                  color="disabled"
                  size={textSizeEnum.small}
                />
                <CustomText
                  value={attendance.checkin?.toLocaleTimeString() ?? '7:00 pm'}
                  size={textSizeEnum.mediumBold}
                />
              </View>
            </Row>
          ) : (
            <CustomButton
              backgroundColor={theme.color.green}
              title="Checkin"
              buttonStyle={styles.button}
              onButtonPress={() => sheetRef.current?.snapToIndex(1)}
              disabled={false}
            />
          )}
          {attendance.checkout ? (
            <Row alignCenter style={styles.buttonShadow}>
              <IC_CHECKOUT />
              <View style={styles.view}>
                <CustomText
                  value={'Checkin'}
                  color="disabled"
                  size={textSizeEnum.small}
                />
                <CustomText
                  value={attendance.checkin?.toLocaleTimeString() ?? '7:00 pm'}
                  size={textSizeEnum.mediumBold}
                />
              </View>
            </Row>
          ) : (
            <CustomButton
              backgroundColor={theme.color.red}
              title="Checkout"
              buttonStyle={styles.button}
              disabled={false}
            />
          )}
        </Row>
        <CheckinCheckoutBottomSheet
          ref={sheetRef}
          type={'checkin'}
          onPressButton={onPressConfirm}
        />
      </>
    </CardOuter>
  );
};

export default ShortlistedCandidateCard;

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    width: verticalScale(151),
  },
  buttonShadow: {
    borderRadius: 8,
    width: verticalScale(151),
    paddingHorizontal: verticalScale(12),
    paddingVertical: verticalScale(6),
    height: verticalScale(48),
    backgroundColor: '#fff',
    shadowColor: 'rgba(18, 18, 18, 0.5)',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  view: {
    marginLeft: verticalScale(6),
  },
});
