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
import {ICandidate} from '@api/mockData';
import {convertDateToDobFormat, extractTimeFromDate} from '@utils/constants';
import {ICandidateStatusEnum} from '@utils/enums';

type ICandidateCardProps = {
  item: ICandidate;
  onPressCard: (item: ICandidate) => void;
};

const CandidateCard: React.FC<ICandidateCardProps> = ({item, onPressCard}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <Pressable onPress={() => onPressCard(item)} style={styles.background}>
      <Row
        style={[
          item.status === ICandidateStatusEnum.pending
            ? styles.alignCenter
            : styles.alignStart,
        ]}
        spaceBetween>
        <Row alignCenter>
          {/* <Image
            resizeMode="cover"
            style={styles.image}
            source={ICONS.imagePlaceholder}
          /> */}
          <CandidateProfilePictureView
            name={item?.name}
            url={item?.url}
            status={item?.status}
          />
          <View style={styles.description}>
            <Text style={styles.nameFirst}>{item?.name}</Text>
            <Row alignCenter>
              <Text style={styles.date}>
                {convertDateToDobFormat(item?.date)}
              </Text>
              <View style={styles.divider} />
              <Text style={styles.date}>{extractTimeFromDate(item?.time)}</Text>
            </Row>
          </View>
        </Row>
        {item.status === ICandidateStatusEnum.pending ? (
          <Row style={styles.row}>
            <TouchableOpacity>
              <CROSS_BUTTON
                width={verticalScale(40)}
                height={verticalScale(40)}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <ACCEPT_BUTTON
                width={verticalScale(40)}
                height={verticalScale(40)}
              />
            </TouchableOpacity>
          </Row>
        ) : (
          <TouchableOpacity hitSlop={{top: 5, left: 5, right: 5, bottom: 5}}>
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
