import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CardOuter from '@components/atoms/CardOuter';
import CandidateProfilePictureView from './CandidateProfilePictureView';
import {ICandidateStatusEnum} from '@utils/enums';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import Spacers from '@components/atoms/Spacers';
import CustomButton from '@components/molecules/customButton';
import {useTheme} from '@theme/Theme.context';
import {IC_CHECKIN_GREEN, IC_CHECKOUT} from '@assets/exporter';
import {timeToLocalString} from '@utils/utils.common';

type IShortlistedCandidateCardProps = {
  onPressCard: () => void;
  name: string;
  checkInTime?: null | Date;
  checkOutTime?: null | Date;
  profilePic: string | null;
  onPressCheckIn: (type: 'checkIn') => void;
  onPressCheckOut: (type: 'checkOut') => void;
};

const ShortlistedCandidateCard: React.FC<IShortlistedCandidateCardProps> = ({
  onPressCard,
  name,
  profilePic,
  checkInTime,
  checkOutTime,
  onPressCheckIn,
  onPressCheckOut,
}) => {
  const {theme} = useTheme();

  const [attendance, setAttendance] = useState<{
    checkin: null | Date;
    checkout: null | Date;
  }>({
    checkin: null,
    checkout: null,
  });

  useEffect(() => {
    if (checkInTime && checkOutTime) {
      setAttendance(prev => ({
        ...prev,
        checkin: new Date(checkInTime),
        checkout: new Date(checkOutTime),
      }));
    } else if (checkOutTime) {
      setAttendance(prev => ({...prev, checkout: new Date(checkOutTime)}));
    } else if (checkInTime) {
      setAttendance(prev => ({...prev, checkin: new Date(checkInTime)}));
    } else {
      setAttendance(prev => ({
        ...prev,
        checkin: null,
        checkout: null,
      }));
    }
  }, [checkInTime, checkOutTime]);

  return (
    <CardOuter onPress={onPressCard}>
      <>
        <Row alignCenter>
          <CandidateProfilePictureView
            name={name}
            url={profilePic}
            textSize="small"
            size={verticalScale(32)}
            status={ICandidateStatusEnum.selected}
          />
          <Spacers size={12} scalable type={'horizontal'} />
          <View>
            <CustomText value={name} size={textSizeEnum.mediumBold} />
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
                  value={timeToLocalString(attendance.checkin)}
                  size={textSizeEnum.mediumBold}
                />
              </View>
            </Row>
          ) : (
            <CustomButton
              backgroundColor={theme.color.green}
              title="Checkin"
              buttonStyle={styles.button}
              onButtonPress={() => onPressCheckIn('checkIn')}
              disabled={false}
            />
          )}
          {attendance.checkout ? (
            <Row alignCenter style={styles.buttonShadow}>
              <IC_CHECKOUT />
              <View style={styles.view}>
                <CustomText
                  value={'Checkout'}
                  color="disabled"
                  size={textSizeEnum.small}
                />
                <CustomText
                  value={timeToLocalString(attendance.checkin)}
                  size={textSizeEnum.mediumBold}
                />
              </View>
            </Row>
          ) : (
            <CustomButton
              backgroundColor={theme.color.red}
              title="Checkout"
              onButtonPress={() => onPressCheckOut('checkOut')}
              buttonStyle={styles.button}
              disabled={false}
            />
          )}
        </Row>
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
