import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {SvgProps} from 'react-native-svg';

type ISelectOptionCardProps = {
  title: string;
  icon: React.FC<SvgProps>;
  isDisabled?: boolean;
  onPress: () => void;
};

const SelectOptionCard: React.FC<ISelectOptionCardProps> = ({
  title,
  icon,
  isDisabled,
  onPress,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const Icon = icon;

  const onButtonPress = () => {
    if (isDisabled) {
      return null;
    } else {
      return onPress();
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={isDisabled ? 0.5 : 0}
      style={[isDisabled && styles.disabled]}
      onPress={onButtonPress}>
      <View style={styles.innerView}>
        <View style={styles.imgBg}>
          <Icon width={verticalScale(24)} height={verticalScale(24)} />
        </View>
        <Text style={styles.uploadText}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(SelectOptionCard);

export const getStyles = (theme: Theme) =>
  StyleSheet.create({
    innerView: {
      paddingVertical: verticalScale(10),
      flexDirection: 'row',
      alignItems: 'center',
      height: verticalScale(56),
      paddingHorizontal: verticalScale(16),
      backgroundColor: theme.color.ternary,
      borderRadius: 8,
    },
    imgBg: {
      backgroundColor: theme.color.primary,
      padding: verticalScale(8),
      borderRadius: 8,
      marginRight: verticalScale(24),
    },
    uploadText: {
      ...fonts.medium,
      color: theme.color.textPrimary,
    },
    disabled: {
      opacity: 0.5,
    },
  });
