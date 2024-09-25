import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {ACCEPT_BUTTON, CROSS_BUTTON, MEAT_BALL} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';
import CandidateProfilePictureView from './CandidateProfilePictureView';
import {convertDateToDobFormat, extractTimeFromDate} from '@utils/constants';
import {ICandidateStatusEnum} from '@utils/enums';
import {ICandidateTypes} from '@api/features/client/types';

type ICandidateCardProps = {
  item: ICandidateTypes;
  status: ICandidateStatusEnum;
  onPressCard: (item: ICandidateTypes) => void;
  onPressDecline?: (item: ICandidateTypes) => void;
  onPressThreeDots?: (item: ICandidateTypes) => void;
  onPressAccept?: (item: ICandidateTypes) => void;
};

const CandidateCard: React.FC<ICandidateCardProps> = ({
  item,
  onPressCard,
  onPressThreeDots,
  onPressAccept,
  onPressDecline,
  status,
}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <Pressable
      onLayout={event => console.log(event.nativeEvent.layout.height)}
      onPress={() => onPressCard(item)}
      style={styles.background}>
      <Row
        style={[
          status === ICandidateStatusEnum.pending
            ? styles.alignCenter
            : styles.alignStart,
        ]}
        spaceBetween>
        <Row alignCenter>
          <CandidateProfilePictureView
            name={item?.employeeDetails.name}
            url={item?.employeeDetails.selfie?.url ?? null}
            status={status}
          />
          <View style={styles.description}>
            <Text style={styles.nameFirst}>{item?.employeeDetails.name}</Text>
            <Row alignCenter>
              <Text style={styles.date}>
                {convertDateToDobFormat(item?.applicationDate)}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.date}>
                {extractTimeFromDate(item?.applicationDate)}
              </Text>
            </Row>
          </View>
        </Row>
        {status === ICandidateStatusEnum.pending ? (
          <Row style={styles.row}>
            <TouchableOpacity
              onPress={() => onPressDecline && onPressDecline(item)}>
              <CROSS_BUTTON
                width={verticalScale(40)}
                height={verticalScale(40)}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => onPressAccept && onPressAccept(item)}>
              <ACCEPT_BUTTON
                width={verticalScale(40)}
                height={verticalScale(40)}
              />
            </TouchableOpacity>
          </Row>
        ) : (
          <TouchableOpacity
            onPress={() => onPressThreeDots && onPressThreeDots(item)}
            hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
            <MEAT_BALL width={verticalScale(16)} height={verticalScale(16)} />
          </TouchableOpacity>
        )}
      </Row>
    </Pressable>
  );
};

export default CandidateCard;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    background: {
      backgroundColor: theme.color.primary,
      padding: verticalScale(12),
      borderWidth: 1,
      borderColor: 'rgba(18, 18, 18, 0.08)',
      borderRadius: 8,
    },
    nameFirst: {
      ...fonts.mediumBold,
      color: theme.color.textPrimary,
    },
    description: {
      marginLeft: verticalScale(8),
    },
    divider: {
      width: verticalScale(1),
      backgroundColor: theme.color.grey,
      marginHorizontal: verticalScale(4),
      height: verticalScale(12),
    },
    date: {
      color: theme.color.disabled,
      ...fonts.small,
    },
    row: {
      gap: verticalScale(12),
    },
    alignCenter: {
      alignItems: 'center',
    },
    alignStart: {
      alignItems: 'flex-start',
    },
  });
