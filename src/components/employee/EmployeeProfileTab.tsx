import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  Platform,
} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import {WINDOW_WIDTH} from '@gorhom/bottom-sheet';
import AnimatedPressable from '@components/atoms/AnimatedPressable';
import {Row} from '@components/atoms/Row';
import {SvgProps} from 'react-native-svg';
import {fonts} from '@utils/common.styles';
import {RIGHT_ARROW_DROPDOWN} from '@assets/exporter';

type IEmployeeProfileTabProps = {
  Icon: React.FC<SvgProps>;
  title: string;
  withArrow?: boolean;
  titleStyles?: StyleProp<TextStyle>;
  onPressTab: () => void;
};

const EmployeeProfileTab: React.FC<IEmployeeProfileTabProps> = ({
  Icon,
  title,
  onPressTab,
  titleStyles,
  withArrow = true,
}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <View style={styles.shadow}>
      <AnimatedPressable onPress={onPressTab} styles={styles.container}>
        <Row spaceBetween>
          <Row alignCenter>
            <Icon
              style={styles.icon}
              width={verticalScale(24)}
              height={verticalScale(24)}
            />
            <Text style={[styles.title, titleStyles]}>{title}</Text>
          </Row>
          {withArrow && <RIGHT_ARROW_DROPDOWN />}
        </Row>
      </AnimatedPressable>
    </View>
  );
};

export default EmployeeProfileTab;

const getStyles = ({color}: Theme) => {
  const styles = StyleSheet.create({
    container: {
      padding: verticalScale(16),
      borderRadius: 8,
      justifyContent: 'center',
      backgroundColor: color.primary,
      width: WINDOW_WIDTH - verticalScale(48),
      height: verticalScale(56),
    },
    title: {
      ...fonts.medium,
      color: color.textPrimary,
    },
    icon: {
      marginRight: verticalScale(12),
    },
    shadow: {
      ...Platform.select({
        ios: {
          shadowColor: color.shadow,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 1,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
          shadowColor: color.shadow,
        },
      }),
    },
  });
  return styles;
};
