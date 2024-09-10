import {StyleProp, StyleSheet, Text, View, ViewStyle} from 'react-native';
import React, {useMemo} from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {Row} from '@components/atoms/Row';
import {fonts} from '@utils/common.styles';

type IJobDetailsTopTagPropTypes = {
  icon: React.FC<SvgProps>;
  title: string;
  customStyles?: StyleProp<ViewStyle>;
  isMultiple?: boolean;
  titleSec?: string;
  iconSize?: number;
};

const JobDetailsTopTag: React.FC<IJobDetailsTopTagPropTypes> = ({
  icon,
  isMultiple,
  customStyles,
  iconSize,
  title,
  titleSec,
}) => {
  const styles = useThemeAwareObject(createStyles);
  const Icon = useMemo(() => icon, [icon]);
  return (
    <>
      {!isMultiple && (
        <Row style={styles.singleContainer}>
          <Icon
            width={iconSize ?? verticalScale(16)}
            height={iconSize ?? verticalScale(16)}
          />
          <Text style={styles.title}>{title}</Text>
        </Row>
      )}
      {isMultiple && (
        <Row alignCenter style={[styles.multipleContainer, customStyles]}>
          <Row alignCenter>
            <Icon
              width={iconSize ?? verticalScale(16)}
              height={iconSize ?? verticalScale(16)}
            />
            <Text style={styles.title}>{title}</Text>
          </Row>
          <View style={styles.divider} />
          <Text style={styles.titleSec}>{titleSec}</Text>
        </Row>
      )}
    </>
  );
};

export default JobDetailsTopTag;

const createStyles = ({color}: Theme) => {
  return StyleSheet.create({
    container: {},
    title: {
      marginLeft: verticalScale(8),
      ...fonts.regular,
      color: color.black,
      letterSpacing: 0.14,
    },
    titleSec: {
      ...fonts.regular,
      color: color.black,
      letterSpacing: 0.14,
    },
    singleContainer: {
      width: verticalScale(163),
      paddingLeft: verticalScale(13),
      backgroundColor: color.backgroundWhite,
      borderRadius: 4,
      height: verticalScale(40),
      borderWidth: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      borderColor: color.lightGrey,
    },
    multipleContainer: {
      paddingLeft: verticalScale(13),
      width: '100%',
      backgroundColor: color.backgroundWhite,
      borderRadius: 4,
      height: verticalScale(40),
      borderWidth: 1,
      borderColor: color.lightGrey,
    },
    divider: {
      backgroundColor: color.grey,
      width: verticalScale(1),
      marginHorizontal: verticalScale(8),
      height: '80%',
    },
  });
};
