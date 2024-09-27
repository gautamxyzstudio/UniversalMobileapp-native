import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {IJobPostStatus} from '@utils/enums';
import {Theme} from '@theme/Theme.type';
import {STRINGS} from 'src/locales/english';
import {useThemeAwareObject} from '@theme/index';
import {verticalScale, moderateScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {useTheme} from '@theme/Theme.context';

type IJobStatusChipPropsTypes = {
  status: IJobPostStatus;
};

const JobStatusChip: React.FC<IJobStatusChipPropsTypes> = ({status}) => {
  const styles = useThemeAwareObject(createStyles);
  const {theme} = useTheme();
  const attributes = getStatusStylesFromStatus(status, theme);
  return (
    <View
      style={[
        styles.tagContainer,
        {backgroundColor: attributes?.backgroundColor},
      ]}>
      <Text style={[styles.tag, {color: attributes?.color}]}>
        {attributes?.title}
      </Text>
    </View>
  );
};

export default JobStatusChip;

const createStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    tagContainer: {
      backgroundColor: color.lightGrey,
      borderRadius: 20,
      justifyContent: 'center',
      paddingHorizontal: verticalScale(8),
      height: verticalScale(24),
    },
    tag: {
      color: color.textPrimary,
      ...fonts.smallBold,
      ...Platform.select({
        ios: {
          lineHeight: moderateScale(18),
        },
      }),
    },
  });

  return styles;
};

export const getStatusStylesFromStatus = (
  status: IJobPostStatus,
  theme: Theme,
) => {
  switch (status) {
    case IJobPostStatus.CONFIRMED:
      return {
        backgroundColor: theme.color.greenLight,
        color: theme.color.green,
        borderColor: theme.color.green,
        title: STRINGS.confirmed,
      };
    case IJobPostStatus.DECLINED:
      return {
        backgroundColor: theme.color.redLight,
        color: theme.color.red,
        borderColor: theme.color.red,
        title: STRINGS.declined,
      };
    case IJobPostStatus.NO_SHOW:
      return {
        backgroundColor: theme.color.redLight,
        color: theme.color.red,
        borderColor: theme.color.red,
        title: STRINGS.no_show,
      };

    case IJobPostStatus.CANCELED:
      return {
        backgroundColor: theme.color.disabledLight,
        color: theme.color.disabled,
        borderColor: theme.color.disabled,
        title: STRINGS.canceled,
      };
    case IJobPostStatus.COMPLETED:
      return {
        backgroundColor: theme.color.skyBlueLight,
        color: theme.color.darkBlue,
        borderColor: theme.color.blue,
        title: STRINGS.completed,
      };
    case IJobPostStatus.APPLIED:
      return {
        backgroundColor: theme.color.accentLighter,
        color: theme.color.accent,
        borderColor: theme.color.accent,
        title: STRINGS.applied,
      };
    default:
      return null;
  }
};

export const getEventCardStylesFromJobStatus = (
  status: IJobPostStatus,
  theme: Theme,
) => {
  switch (status) {
    case IJobPostStatus.OPEN:
      return {
        backgroundColor: theme.color.yellowLight,
        borderColor: theme.color.yellow,
        shadowColor: theme.color.shadow,
        title: STRINGS.pending,
      };
    case IJobPostStatus.CLOSED:
      return {
        backgroundColor: theme.color.skyBlueLight,
        color: theme.color.darkBlue,
        borderColor: theme.color.blue,
        title: STRINGS.completed,
      };
    case IJobPostStatus.CANCELED:
      return {
        backgroundColor: theme.color.redLight,
        color: theme.color.red,
        borderColor: theme.color.red,
        title: STRINGS.canceled,
      };
    default:
      return {
        backgroundColor: theme.color.yellowLight,
        borderColor: theme.color.yellow,
        shadowColor: theme.color.shadow,
        title: STRINGS.pending,
      };
  }
};
