import {Pressable, StyleSheet, View} from 'react-native';
import React from 'react';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {ICandidateListTypes} from '@api/features/client/types';
import CandidateProfilePictureView from './CandidateProfilePictureView';
import {ICandidateStatusEnum} from '@utils/enums';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import TextWithIcon from '@components/molecules/TextWithIcon';
import {CALENDAR, LOCATION_ICON} from '@assets/exporter';
import {dateFormatter} from '@utils/utils.common';

type IOpenJobsListCardProps = {
  isSelected: boolean;
  onPressCard: () => void;
  job: ICandidateListTypes;
};

const OpenJobsListCard: React.FC<IOpenJobsListCardProps> = ({
  isSelected,
  onPressCard,
  job,
}) => {
  const styles = useThemeAwareObject(createStyles);

  return (
    <Pressable
      onPress={onPressCard}
      style={[styles.outerView, isSelected && styles.containerSelected]}>
      <Row alignCenter>
        <CandidateProfilePictureView
          name={job?.details.jobName ?? 'Amar'}
          url={null}
          status={ICandidateStatusEnum.pending}
        />
        <View style={styles.container}>
          <CustomText
            value={job?.details.jobName}
            size={textSizeEnum.mediumBold}
          />
          <CustomText
            value={`Job ID- ${job?.details.jobId}`}
            color="disabled"
            size={textSizeEnum.regular}
          />
        </View>
      </Row>
      <View style={styles.bottomView}>
        <TextWithIcon
          icon={CALENDAR}
          value={dateFormatter(job.details.eventDate)}
          size={textSizeEnum.regular}
        />
        <TextWithIcon
          icon={LOCATION_ICON}
          value={job.details.location}
          size={textSizeEnum.regular}
        />
      </View>
    </Pressable>
  );
};

export default OpenJobsListCard;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    outerView: {
      borderRadius: 8,
      width: '100%',
      padding: verticalScale(12),
      backgroundColor: '#fff',
      shadowColor: 'rgba(18, 18, 18, 0.5)',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      borderWidth: 1,
      borderColor: theme.color.disabledLight,
      shadowRadius: 4,
      elevation: 4,
    },
    containerSelected: {
      backgroundColor: theme.color.ternary,
      borderColor: '#C2CCF2',
      borderWidth: 1,
    },
    container: {
      marginLeft: verticalScale(12),
      gap: verticalScale(2),
    },
    bottomView: {
      marginTop: verticalScale(12),
      marginLeft: verticalScale(22),
      gap: verticalScale(8),
    },
  });
