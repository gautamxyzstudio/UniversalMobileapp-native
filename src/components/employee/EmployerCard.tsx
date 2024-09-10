import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {verticalScale} from '@utils/metrics';
import {fontFamily, fonts} from '@utils/common.styles';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {STRINGS} from 'src/locales/english';

type IEmployerCardProps = {
  banner: ImageSourcePropType;
  rating: number;
  title: string;
  industry: string;
};

const EmployerCard: React.FC<IEmployerCardProps> = ({
  banner,
  title,
  industry,
}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <View style={styles.container}>
      <Image style={styles.banner} source={banner} />
      <View style={styles.jobContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.industry}>{industry}</Text>
        <View style={styles.bottomView}>
          <Text style={styles.viewText}>{STRINGS.viewJobs}</Text>
        </View>
      </View>
    </View>
  );
};

export default EmployerCard;
const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      borderRadius: 8,
      width: verticalScale(156),
    },
    banner: {
      flex: 1,
      width: 'auto',
      height: verticalScale(84),
      resizeMode: 'contain',
    },
    jobContainer: {
      paddingTop: verticalScale(12),
      borderRadius: 8,
      backgroundColor: color.red,
      marginTop: -12,
      overflow: 'hidden',
      zIndex: 99,
    },
    title: {
      ...fonts.regularBold,
      color: color.textPrimary,
    },
    industry: {
      ...fonts.regular,
      color: color.disabled,
      marginTop: verticalScale(2),
    },
    bottomView: {
      paddingVertical: 10,
      backgroundColor: color.secondary,
    },
    viewText: {
      ...fonts.small,
      fontFamily: fontFamily.bold,
      textAlign: 'center',
      color: color.blueLight,
    },
  });
  return styles;
};
