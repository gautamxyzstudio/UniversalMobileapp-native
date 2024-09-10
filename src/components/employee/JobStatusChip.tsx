import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Theme, useThemeAwareObject} from '@theme/index';
import {moderateScale, verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {IJobTypesEnum} from '@utils/enums';
import {capitalizeFirstLetter} from '@utils/utils.common';

type IJobStatusChipProps = {
  backgroundColor: string;
  color: string;
  status: IJobTypesEnum;
};

const JobStatusChip: React.FC<IJobStatusChipProps> = ({
  backgroundColor,
  color,
  status,
}) => {
  const styles = useThemeAwareObject(createStyles);

  return (
    <View style={[styles.tagContainer, {backgroundColor: backgroundColor}]}>
      <Text style={[styles.tag, {color: color}]}>
        {capitalizeFirstLetter(status)}
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
