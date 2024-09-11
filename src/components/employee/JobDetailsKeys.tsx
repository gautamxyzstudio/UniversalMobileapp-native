import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {Row} from '@components/atoms/Row';

type IJobDetailsKeyPropTypes = {
  heading: string;
  value: string;
};

const JobDetailsKey: React.FC<IJobDetailsKeyPropTypes> = ({heading, value}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <Row style={styles.row} spaceBetween alignCenter>
      <Text style={styles.heading}>{heading}</Text>
      <Text style={styles.title}>{value}</Text>
    </Row>
  );
};

export default JobDetailsKey;

const createStyles = ({color}: Theme) => {
  return StyleSheet.create({
    container: {
      backgroundColor: color.backgroundWhite,
      width: verticalScale(163),
      borderRadius: 4,
      height: verticalScale(40),
      borderWidth: 1,
      borderColor: color.lightGrey,
      paddingVertical: verticalScale(11),
      paddingLeft: verticalScale(13),
    },
    row: {
      width: '100%',
    },
    title: {
      ...fonts.regular,
      letterSpacing: 0.14,
      color: color.textPrimary,
    },
    heading: {
      ...fonts.regularBold,
      letterSpacing: 0.16,
      color: color.textPrimary,
    },
  });
};
