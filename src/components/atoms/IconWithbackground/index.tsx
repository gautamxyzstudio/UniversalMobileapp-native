import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {useTheme} from '@theme/Theme.context';
import {verticalScale} from '@utils/metrics';

type IIconWithBackgroundPropTypes = {
  icon: React.FC<SvgProps>;
  backgroundColor?: string;
  customStyles?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

const IconWithBackground: React.FC<IIconWithBackgroundPropTypes> = ({
  icon,
  backgroundColor,
  onPress,
  customStyles,
}) => {
  const Icon = icon;
  const {theme} = useTheme();
  return (
    <View
      style={[
        styles.filters,

        {backgroundColor: backgroundColor ?? theme.color.lightGrey},
        customStyles,
      ]}>
      <TouchableOpacity onPress={onPress}>
        <Icon width={verticalScale(24)} height={verticalScale(24)} />
      </TouchableOpacity>
    </View>
  );
};

export default IconWithBackground;

const styles = StyleSheet.create({
  filters: {
    width: verticalScale(36),
    height: verticalScale(36),
    borderRadius: verticalScale(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
