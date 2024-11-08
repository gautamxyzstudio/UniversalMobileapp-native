import {StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {Row} from '@components/atoms/Row';
import {ICONS, SWITCH} from '@assets/exporter';
import {fonts} from '@utils/common.styles';
import SegmentView, {
  ISegmentViewRefMethods,
} from '@components/organisms/segmentView';
import {STRINGS} from 'src/locales/english';
import CustomImageComponent from '@components/atoms/customImage';
import {userAdvanceDetailsFromState} from '@api/features/user/userSlice';
import {useSelector} from 'react-redux';
import {IClientDetails} from '@api/features/user/types';
import {extractDayAndMonthFromDate} from '@utils/constants';

type ICandidateListTopViewProps = {
  onPressTab?: (index: number) => void;
  onPressFilter?: () => void;
  jobName: string;
  index?: number;

  jobId: number;
  creationDate?: Date;
  withSwitch?: boolean;
  withSegmentView?: boolean;
};

const CandidateListTopView: React.FC<ICandidateListTopViewProps> = ({
  jobId,
  index,
  jobName,
  onPressTab,

  creationDate,
  withSwitch = true,
  withSegmentView = true,
  onPressFilter,
}) => {
  const ref = useRef<ISegmentViewRefMethods | null>(null);
  const styles = useThemeAwareObject(createStyles);
  const user = useSelector(userAdvanceDetailsFromState) as IClientDetails;

  const onClick = (jIndex: number) => {
    ref.current?.getIndex(jIndex);
    onPressTab && onPressTab(jIndex);
  };

  return (
    <View style={styles.mainView}>
      <Row spaceBetween alignCenter>
        <Row alignCenter>
          <CustomImageComponent
            defaultSource={ICONS.imagePlaceholder}
            image={user.company?.companylogo?.url}
            customStyle={styles.image}
          />
          <View style={styles.detailsView}>
            <Text style={styles.title}>{jobName}</Text>
            <Text style={styles.jobId}>{`Job ID-${jobId}`}</Text>
            {creationDate && (
              <Text style={styles.jobId}>
                {extractDayAndMonthFromDate(creationDate)}
              </Text>
            )}
          </View>
        </Row>
        {withSwitch && (
          <TouchableOpacity onPress={onPressFilter}>
            <SWITCH />
            <View style={styles.redDot} />
          </TouchableOpacity>
        )}
      </Row>

      {withSegmentView && (
        <View style={styles.segmentView}>
          <SegmentView
            tabs={[STRINGS.applicants, STRINGS.shortlisted, STRINGS.deny]}
            segmentTextStyles={styles.segmentText}
            marginHorizontal={0}
            ref={ref}
            onClick={onClick}
            currentIndex={index ?? 0}
          />
        </View>
      )}
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
      // height: verticalScale(101.3),
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
