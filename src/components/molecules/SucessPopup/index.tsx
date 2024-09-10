import {Image, ImageSourcePropType, StyleSheet, Text} from 'react-native';
import React from 'react';
import CustomModal from '../customModal';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/index';

type ISuccessPopup = {
  isVisible: boolean;
  description?: string;
  title?: string;
  icon?: ImageSourcePropType;
};

const SuccessPopup: React.FC<ISuccessPopup> = ({
  isVisible,
  description,
  title,
  icon,
}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <CustomModal isVisible={isVisible}>
      {icon && <Image style={styles.animation} source={icon} />}
      {title && <Text style={styles.title}>{title}</Text>}
      {description && <Text style={styles.description}>{description}</Text>}
    </CustomModal>
  );
};

export default SuccessPopup;

export const getStyles = (colors: Theme) => {
  const styles = StyleSheet.create({
    animation: {
      width: verticalScale(56),
      height: verticalScale(56),
      alignSelf: 'center',
    },
    title: {
      alignSelf: 'center',
      marginTop: verticalScale(8),
      ...fonts.headingSmall,
      color: colors.color.textPrimary,
    },
    description: {
      alignSelf: 'center',
      ...fonts.regular,
      color: colors.color.disabled,
      marginTop: verticalScale(8),
    },
  });
  return styles;
};
