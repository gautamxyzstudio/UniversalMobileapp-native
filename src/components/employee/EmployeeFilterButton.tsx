import {StyleSheet} from 'react-native';
import React from 'react';
import {SvgProps} from 'react-native-svg';
import {Row} from '@components/atoms/Row';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {IC_ARROW_DOWN} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import AnimatedPressable from '@components/atoms/AnimatedPressable';

type IEmployeeFilterButtonProps = {
  icon: React.FC<SvgProps>;
  title: string;
  onPress: () => void;
};

const EmployeeFilterButton: React.FC<IEmployeeFilterButtonProps> = ({
  icon,
  title,
  onPress,
}) => {
  const ICON = icon;
  const styles = useThemeAwareObject(createStyles);
  return (
    <AnimatedPressable onPress={onPress}>
      <Row style={styles.outer} alignCenter>
        <ICON width={verticalScale(16)} height={verticalScale(16)} />
        <CustomText
          customTextStyles={styles.title}
          value={title}
          color="darkBlue"
          size={textSizeEnum.regular}
        />
        <IC_ARROW_DOWN
          style={styles.arrow}
          width={verticalScale(12)}
          height={verticalScale(10)}
        />
      </Row>
    </AnimatedPressable>
  );
};

export default EmployeeFilterButton;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    outer: {
      borderWidth: 1,
      borderRadius: 20,
      backgroundColor: theme.color.primary,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderColor: theme.color.strokeLight,
    },
    arrow: {
      marginLeft: verticalScale(4),
      marginTop: 2,
    },
    title: {
      marginLeft: verticalScale(8),
    },
  });
  return styles;
};
