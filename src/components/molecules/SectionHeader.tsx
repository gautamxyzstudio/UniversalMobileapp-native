import {StyleSheet, View} from 'react-native';
import React from 'react';
import CustomText, {ITextPropsBasic} from '@components/atoms/CustomText';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';

interface ISectionHeaderProps extends ITextPropsBasic {}

const SectionHeader: React.FC<ISectionHeaderProps> = ({...textProps}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <CustomText {...textProps} />
    </View>
  );
};

export default SectionHeader;

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingLeft: verticalScale(24),
      borderBottomWidth: 1,
      borderBottomColor: theme.color.strokeLight,
      paddingBottom: verticalScale(12),
    },
  });
