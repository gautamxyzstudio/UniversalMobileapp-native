import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';
import {verticalScale} from '@utils/metrics';

type IBrTagPropTypes = {
  tagStyles?: StyleProp<ViewStyle>;
  marginVertical?: number;
};

const BrTag: React.FC<IBrTagPropTypes> = ({tagStyles, marginVertical}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View
      style={[
        styles.br,
        tagStyles,
        {marginVertical: marginVertical ?? verticalScale(12)},
        tagStyles,
      ]}
    />
  );
};

export default BrTag;
const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    br: {
      height: verticalScale(1),
      backgroundColor: theme.color.grey,
    },
  });
  return styles;
};
