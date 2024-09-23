import {Image, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {Row} from '@components/atoms/Row';
import {ICONS, SWITCH} from '@assets/exporter';
import {fonts} from '@utils/common.styles';
import SegmentView from '@components/organisms/segmentView';
import {STRINGS} from 'src/locales/english';

type ICandidateListTopViewProps = {
  currentIndex: number;
  onClick: (index: number) => void;
  onPressFilter: () => void;
  jobName: string;
  jobId: number;
};

const CandidateListTopView: React.FC<ICandidateListTopViewProps> = ({
  currentIndex,
  onClick,
  jobId,
  jobName,
  onPressFilter,
}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.mainView}>
      <Row spaceBetween alignCenter>
        <Row alignCenter>
          <Image
            resizeMode="cover"
            style={styles.image}
            source={ICONS.imagePlaceholder}
          />
          <View style={styles.detailsView}>
            <Text style={styles.title}>{jobName}</Text>
            <Text style={styles.jobId}>{`Job ID-${jobId}`}</Text>
          </View>
        </Row>
        <TouchableOpacity onPress={onPressFilter}>
          <SWITCH />
          <View style={styles.redDot} />
        </TouchableOpacity>
      </Row>
      <View style={styles.segmentView}>
        <SegmentView
          tabs={[STRINGS.applicants, STRINGS.shortlisted, STRINGS.deny]}
          segmentTextStyles={styles.segmentText}
          marginHorizontal={0}
          onClick={onClick}
          currentIndex={currentIndex}
        />
      </View>
    </View>
  );
};

export default CandidateListTopView;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    mainView: {
      paddingTop: verticalScale(24),
      paddingBottom: verticalScale(12),
      paddingHorizontal: verticalScale(24),
      shadowColor: theme.color.shadow,
      backgroundColor: theme.color.ternary,
      shadowOffset: {width: 0, height: 0},
      shadowOpacity: 1,
      elevation: 8,
    },
    image: {
      width: verticalScale(48),
      height: verticalScale(48),
      borderRadius: verticalScale(24),
    },
    detailsView: {
      marginLeft: verticalScale(12),
    },
    jobId: {
      marginTop: verticalScale(4),
      color: theme.color.disabled,
      ...fonts.regular,
    },
    title: {
      color: theme.color.textPrimary,
      ...fonts.mediumBold,
    },
    redDot: {
      width: verticalScale(8),
      height: verticalScale(8),
      borderRadius: verticalScale(4),
      backgroundColor: '#C11919',
      position: 'absolute',
      right: 0,
      top: 0,
    },
    segmentText: {
      ...fonts.regular,
    },
    segmentView: {
      marginTop: verticalScale(22),
    },
  });
